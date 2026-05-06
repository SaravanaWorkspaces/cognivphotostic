'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmartImagePicker from '@/components/ui/SmartImagePicker';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CategoryOption { id: number; documentId: string; name: string; slug: string }

export interface PostFormInitial {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  categoryId?: number | null;
  coverImageId: number | null;
  coverPreviewUrl: string | null;
  isPublished: boolean;
}

interface Props {
  mode: 'create' | 'edit';
  /** Strapi documentId (edit mode only) */
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

function Field({
  label, hint, required, children,
}: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-1">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        {required && <span className="text-red-500 text-xs">*</span>}
        {hint && <span className="text-xs text-gray-400 ml-1">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-shadow';

// ─── Component ───────────────────────────────────────────────────────────────
export default function PostForm({ mode, documentId, initial }: Props) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  // Form state
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(isEdit); // don't auto-rewrite slug in edit mode
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [categoryId, setCategoryId] = useState<string>(
    initial?.categoryId != null ? String(initial.categoryId) : '',
  );
  const [coverImageId, setCoverImageId] = useState<number | null>(initial?.coverImageId ?? null);
  const [, setCoverPreview] = useState<string | null>(initial?.coverPreviewUrl ?? null);

  // UI state
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ message: string } | null>(null);

  // Auto-slug from title (create mode only)
  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.data ?? []))
      .catch(() => {});
  }, []);

  // Validate required fields
  const canSubmit =
    title.trim().length > 0 &&
    slug.trim().length > 0 &&
    excerpt.trim().length > 0 &&
    coverImageId !== null;

  const handleSubmit = async (publish: boolean) => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      author: author.trim() || 'Admin',
      coverImage: coverImageId,
      ...(categoryId ? { category: parseInt(categoryId) } : { category: null }),
    };

    if (publish) payload.publishedAt = new Date().toISOString();
    else payload.publishedAt = null; // explicit unpublish on save-draft

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

      const newSlug = data.data?.slug ?? slug;
      setDone({
        message: isEdit
          ? (publish ? 'Post updated and published.' : 'Draft saved.')
          : (publish ? 'Post created and published.' : 'Draft created.'),
      });

      // After a short pause, send the user to the right place
      setTimeout(() => {
        if (publish) router.push(`/blog/${newSlug}`);
        else router.push('/admin/posts');
      }, 1200);
    } catch {
      setSubmitError('Network error — make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
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
      {/* Cover image */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <SmartImagePicker
          label={isEdit ? 'Cover Image (re-upload to change)' : 'Cover Image'}
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
            <img src={initial.coverPreviewUrl} alt="Current cover" className="w-full max-h-56 object-cover block" />
            <p className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
              Current cover image
            </p>
          </div>
        )}
      </div>

      {/* Core fields */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
        <Field label="Title" required>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter post title…"
            maxLength={120}
            className={inputCls}
          />
        </Field>

        <Field label="Slug" hint={isEdit ? 'edit with care — changes the URL' : 'auto-generated from title'}>
          <div className="flex gap-2">
            <input
              value={slug}
              onChange={e => { setSlug(toSlug(e.target.value)); setSlugEdited(true); }}
              placeholder="post-url-slug"
              className={`${inputCls} font-mono text-xs`}
            />
            {!isEdit && slugEdited && (
              <button
                type="button"
                onClick={() => { setSlug(toSlug(title)); setSlugEdited(false); }}
                className="shrink-0 px-3 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                title="Reset to auto-generated slug"
              >
                Reset
              </button>
            )}
          </div>
        </Field>

        <Field label="Excerpt" required hint="shown on blog cards">
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="A short summary of this post…"
            rows={3}
            maxLength={300}
            className={`${inputCls} resize-none`}
          />
          <p className="text-right text-xs text-gray-400">{excerpt.length}/300</p>
        </Field>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Author">
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Admin"
              className={inputCls}
            />
          </Field>

          <Field label="Category">
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className={inputCls}
            >
              <option value="">— None —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Validation hint */}
      {!canSubmit && (title || excerpt || coverImageId) && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span>⚠️</span>
          <span>
            {!title.trim() ? 'Add a title. ' : ''}
            {!excerpt.trim() ? 'Add an excerpt. ' : ''}
            {coverImageId === null ? 'Upload a cover image to continue.' : ''}
          </span>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="mt-0.5 shrink-0">✕</span>
          <span>{submitError}</span>
        </div>
      )}

      {/* Action bar */}
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
          {submitting ? (isEdit ? 'Updating…' : 'Publishing…') : (isEdit ? '💾 Update & Publish' : '🚀 Publish Post')}
        </button>
      </div>
    </div>
  );
}
