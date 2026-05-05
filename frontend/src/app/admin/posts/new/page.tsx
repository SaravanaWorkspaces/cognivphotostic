'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import SmartImagePicker from '@/components/ui/SmartImagePicker';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CategoryOption { id: number; documentId: string; name: string; slug: string; }

// ─── Slug helper ─────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Small field primitives ───────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NewPostPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverImageId, setCoverImageId] = useState<number | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // UI state
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Auto-slug from title
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

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

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
      ...(categoryId ? { category: parseInt(categoryId) } : {}),
    };

    if (publish) payload.publishedAt = new Date().toISOString();

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to create post. Please try again.');
        return;
      }

      setSubmitted(true);
      const newSlug = data.data?.slug ?? slug;
      setTimeout(() => router.push(`/blog/${newSlug}`), 1500);
    } catch {
      setSubmitError('Network error — check that the server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold text-gray-900">Post created!</h2>
          <p className="text-sm text-gray-500">Redirecting to the post…</p>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Back to blog"
          >
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-900">New Post</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={!canSubmit || submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!canSubmit || submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Publishing…' : 'Publish'}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Cover image — full width, prominent */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <SmartImagePicker
            label="Cover Image"
            disabled={submitting}
            onPick={(img) => {
              setCoverImageId(img.fileId);
              setCoverPreview(img.strapiUrl);
            }}
            onClear={() => { setCoverImageId(null); setCoverPreview(null); }}
          />
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

          <Field label="Slug" hint="auto-generated from title">
            <div className="flex gap-2">
              <input
                value={slug}
                onChange={e => { setSlug(toSlug(e.target.value)); setSlugEdited(true); }}
                placeholder="post-url-slug"
                className={`${inputCls} font-mono text-xs`}
              />
              {slugEdited && (
                <button
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

        {/* Meta: author + category + tags */}
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

          <Field label="Tags" hint="press Enter to add">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add a tag…"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="shrink-0 px-3.5 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-medium"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 text-brand-400 hover:text-brand-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Field>
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

        {/* Bottom action bar (mirrors top) */}
        <div className="flex gap-3 pt-2 pb-8">
          <button
            onClick={() => handleSubmit(false)}
            disabled={!canSubmit || submitting}
            className="flex-1 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!canSubmit || submitting}
            className="flex-1 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Publishing…' : '🚀 Publish Post'}
          </button>
        </div>
      </main>
    </div>
  );
}
