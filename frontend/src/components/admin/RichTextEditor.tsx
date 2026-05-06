'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Initial HTML to render. Only set on mount. */
  initialHtml?: string;
  onChange: (html: string, plainText: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  initialHtml = '',
  onChange,
  disabled,
  placeholder = 'Write your post…',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const savedRange = useRef<Range | null>(null);

  // Hydrate initial HTML once on mount
  useEffect(() => {
    if (editorRef.current && initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fireChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const plain = editorRef.current.innerText;
    onChange(html, plain);
  };

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    fireChange();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const r = savedRange.current;
    if (!r) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  };

  const openLinkInput = () => {
    saveSelection();
    setLinkUrl('');
    setShowLinkInput(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) { setShowLinkInput(false); return; }
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    restoreSelection();
    document.execCommand('createLink', false, href);
    // Force target=_blank on the inserted link
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node.nodeType !== 1) node = node.parentNode;
      const a = (node as HTMLElement | null)?.closest?.('a');
      if (a) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    }
    setShowLinkInput(false);
    setLinkUrl('');
    fireChange();
  };

  const removeLink = () => {
    exec('unlink');
  };

  const ToolbarBtn = ({
    label, onMouseDown, children, active,
  }: {
    label: string;
    onMouseDown: () => void;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      className={
        'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors disabled:opacity-40 ' +
        (active
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100')
      }
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent transition-shadow">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        <ToolbarBtn label="Bold (Ctrl+B)" onMouseDown={() => exec('bold')}>
          <span className="font-bold">B</span>
        </ToolbarBtn>
        <ToolbarBtn label="Italic (Ctrl+I)" onMouseDown={() => exec('italic')}>
          <span className="italic font-serif">I</span>
        </ToolbarBtn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn label="Insert link" onMouseDown={openLinkInput}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn label="Remove link" onMouseDown={removeLink}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5M3 3l18 18M10.05 15.95L8.464 17.536a4.5 4.5 0 01-6.364-6.364l1.757-1.757" />
          </svg>
        </ToolbarBtn>

        {showLinkInput && (
          <div className="ml-2 flex-1 flex items-center gap-1.5">
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') setShowLinkInput(false);
              }}
              placeholder="Paste URL and press Enter"
              className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyLink(); }}
              className="text-xs font-medium px-2 py-1 rounded bg-gray-900 text-white hover:bg-gray-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        spellCheck
        onInput={fireChange}
        onBlur={fireChange}
        data-placeholder={placeholder}
        className="rich-editor min-h-[260px] px-4 py-3 text-sm text-gray-900 focus:outline-none leading-relaxed"
      />

      <style jsx global>{`
        .rich-editor:empty:before {
          content: attr(data-placeholder);
          color: rgb(156 163 175);
          pointer-events: none;
        }
        .rich-editor p { margin-bottom: 0.85em; }
        .rich-editor a { color: rgb(37 99 235); text-decoration: underline; text-underline-offset: 2px; }
        .rich-editor a:hover { color: rgb(29 78 216); }
        .rich-editor strong { font-weight: 600; }
      `}</style>
    </div>
  );
}
