'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartImagePicker from '@/components/ui/SmartImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { deriveExcerpt as deriveExcerptFromHtml, htmlToPlainText } from '@/lib/html-clean';

export interface PostFormInitial {
  title: string;
  slug: string;
  coverImageId: number | null;
  coverPreviewUrl: string | null;
  /** Pre-existing content as HTML (concatenated text blocks). */
  contentHtml: string;
  isPublished: boolean;
  categoryId: number | null;
  tagIds: number[];
}

export interface TaxonomyOption {
  id: number;
  name: string;
}

interface Props {
  mode: 'create' | 'edit';
  documentId?: string;
  initial?: PostFormInitial;
  categories: TaxonomyOption[];
  tags: TaxonomyOption[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const deriveExcerpt = deriveExcerptFromHtml;
const htmlToPlain = htmlToPlainText;

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-shadow';

// ─── Component ───────────────────────────────────────────────────────────────
export default function PostForm({ mode, documentId, initial, categories, tags }: Props) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(initial?.title ?? '');
  const [coverImageId, setCoverImageId] = useState<number | null>(initial?.coverImageId ?? null);
  const [, setCoverPreview] = useState<string | null>(initial?.coverPreviewUrl ?? null);
  const [contentHtml, setContentHtml] = useState<string>(initial?.contentHtml ?? '');
  const [contentText, setContentText] = useState<string>(() => htmlToPlain(initial?.contentHtml ?? ''));
  const [categoryId, setCategoryId] = useState<number | null>(initial?.categoryId ?? null);
  const [tagIds, setTagIds] = useState<Set<number>>(() => new Set(initial?.tagIds ?? []));

  const toggleTag = (id: number) => {
    setTagIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ message: string } | null>(null);

  // Required: cover, title, content (min 500 chars, no max)
  const MIN_CONTENT_CHARS = 500;
  const contentLength = contentText.trim().length;
  const hasContent = contentLength > 0 || /<img|<a/i.test(contentHtml);
  const meetsMinLength = contentLength >= MIN_CONTENT_CHARS;
  const canSubmit =
    coverImageId !== null &&
    title.trim().length > 0 &&
    hasContent &&
    meetsMinLength;

  const handleSubmit = async (publish: boolean) => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    const finalSlug = toSlug(title) || `post-${Date.now()}`;
    const finalExcerpt = deriveExcerpt(contentHtml) || title.trim();

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: finalExcerpt,
      author: 'Admin',
      coverImage: coverImageId,
      category: categoryId,
      tags: Array.from(tagIds),
      blocks: [
        { __component: 'blocks.text', body: contentHtml },
      ],
      publishedAt: publish ? new Date().toISOString() : null,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${documentId}` : '/api/admin/posts';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Save failed. Please try again.');
        return;
      }

      setDone({
        message: isEdit
          ? (publish ? 'Post updated and published.' : 'Draft saved.')
          : (publish ? 'Post created and published.' : 'Draft created.'),
      });

      setTimeout(() => router.push('/admin/posts'), 1200);
    } catch {
      setSubmitError('Network error — make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-bold text-gray-900">{done.message}</h2>
          <p className="text-sm text-gray-500">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header image */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <SmartImagePicker
          label="Header Image *"
          disabled={submitting}
          onPick={(img) => {
            setCoverImageId(img.fileId);
            setCoverPreview(img.strapiUrl);
          }}
          onClear={() => { setCoverImageId(null); setCoverPreview(null); }}
        />
        {isEdit && initial?.coverPreviewUrl && coverImageId === initial.coverImageId && (
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={initial.coverPreviewUrl} alt="Current header" className="w-full max-h-56 object-cover block" />
            <p className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
              Current header image
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-baseline gap-1 mb-1.5">
          <label htmlFor="post-title" className="text-sm font-semibold text-gray-800">Title</label>
          <span className="text-red-500 text-xs">*</span>
        </div>
        <input
          id="post-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter post title…"
          maxLength={120}
          disabled={submitting}
          className={inputCls}
        />
      </div>

      {/* Category + Tags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
        <div>
          <label htmlFor="post-category" className="block text-sm font-semibold text-gray-800 mb-1.5">
            Category <span className="text-xs font-normal text-gray-400 ml-1">optional</span>
          </label>
          <select
            id="post-category"
            value={categoryId ?? ''}
            onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            disabled={submitting}
            className={inputCls}
          >
            <option value="">— None —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-gray-400 mt-1.5">
              No categories yet. Add one in the Strapi admin.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Tags <span className="text-xs font-normal text-gray-400 ml-1">optional</span>
          </label>
          {tags.length === 0 ? (
            <p className="text-xs text-gray-400">No tags yet. Add some in the Strapi admin.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map(t => {
                const active = tagIds.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    disabled={submitting}
                    className={
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ' +
                      (active
                        ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')
                    }
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-baseline gap-1 mb-1.5">
          <label className="text-sm font-semibold text-gray-800">Content</label>
          <span className="text-red-500 text-xs">*</span>
          <span className="text-xs text-gray-400 ml-1">supports bold, italic, and links</span>
          <span
            className={
              'ml-auto text-xs font-medium ' +
              (meetsMinLength ? 'text-green-600' : 'text-gray-500')
            }
          >
            {contentLength.toLocaleString()} / {MIN_CONTENT_CHARS} min
          </span>
        </div>
        <RichTextEditor
          initialHtml={initial?.contentHtml ?? ''}
          disabled={submitting}
          onChange={(html, text) => {
            setContentHtml(html);
            setContentText(text);
          }}
          placeholder="Write your post here. Select text and click the link icon to insert a hyperlink."
        />
      </div>

      {/* Validation hint */}
      {!canSubmit && (title || hasContent || coverImageId) && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span>⚠️</span>
          <span>
            {coverImageId === null ? 'Upload a header image. ' : ''}
            {!title.trim() ? 'Add a title. ' : ''}
            {!hasContent
              ? 'Write some content. '
              : !meetsMinLength
                ? `Content must be at least ${MIN_CONTENT_CHARS} characters (${MIN_CONTENT_CHARS - contentLength} more to go).`
                : ''}
          </span>
        </div>
      )}

      {submitError && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="mt-0.5 shrink-0">✕</span>
          <span>{submitError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={!canSubmit || submitting}
          className="flex-1 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving…' : (isEdit ? 'Save as Draft' : 'Save Draft')}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={!canSubmit || submitting}
          className="flex-1 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (isEdit ? 'Updating…' : 'Publishing…') : (isEdit ? 'Update & Publish' : 'Publish Post')}
        </button>
      </div>
    </div>
  );
}
