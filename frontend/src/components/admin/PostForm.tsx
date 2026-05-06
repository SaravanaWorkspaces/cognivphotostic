'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartImagePicker from '@/components/ui/SmartImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';

export interface PostFormInitial {
  title: string;
  slug: string;
  coverImageId: number | null;
  coverPreviewUrl: string | null;
  /** Pre-existing content as HTML (concatenated text blocks). */
  contentHtml: string;
  isPublished: boolean;
}

interface Props {
  mode: 'create' | 'edit';
  documentId?: string;
  initial?: PostFormInitial;
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

/** Strip HTML and collapse whitespace, then trim to maxLen for the excerpt. */
function deriveExcerpt(html: string, maxLen = 220): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = (tmp.textContent ?? '').replace(/\s+/g, ' ').trim();
  return text.slice(0, maxLen);
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-shadow';

// ─── Component ───────────────────────────────────────────────────────────────
export default function PostForm({ mode, documentId, initial }: Props) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(initial?.title ?? '');
  const [coverImageId, setCoverImageId] = useState<number | null>(initial?.coverImageId ?? null);
  const [, setCoverPreview] = useState<string | null>(initial?.coverPreviewUrl ?? null);
  const [contentHtml, setContentHtml] = useState<string>(initial?.contentHtml ?? '');
  const [contentText, setContentText] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ message: string } | null>(null);

  // Required: cover, title, content
  const hasContent = (contentText.trim().length > 0) || /<img|<a/i.test(contentHtml);
  const canSubmit =
    coverImageId !== null &&
    title.trim().length > 0 &&
    hasContent;

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

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-baseline gap-1 mb-1.5">
          <label className="text-sm font-semibold text-gray-800">Content</label>
          <span className="text-red-500 text-xs">*</span>
          <span className="text-xs text-gray-400 ml-1">supports bold, italic, and links</span>
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
            {!hasContent ? 'Write some content.' : ''}
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
