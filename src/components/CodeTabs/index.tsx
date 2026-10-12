// src/components/CodeTabs/index.tsx
//
// Tabbed code panel used throughout the docs and on the landing page.
// Callers pass a plain array of { label, language, code }.
//
// Optional header props (method / endpoint / environment / docsLink) turn
// it into the "request panel" shown on the landing page. With only `tabs`
// it behaves like a plain tabbed code block, so existing MDX usage keeps
// working.
//
// Highlighting is a small dependency-free tokenizer: it only needs to look
// good for the cURL / Node / Python / PHP request examples.
//
// React 19 note: the global JSX namespace was removed, so no return types
// reference it; inference does the work.

import React, { useId, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface CodeTab {
  label: string;
  language: string;
  code: string;
}

interface DocsLink {
  label: string;
  to: string;
}

interface Props {
  tabs: CodeTab[];
  /** Optional default tab index (0-based). Defaults to 0. */
  defaultTab?: number;
  /** HTTP method pill, e.g. "POST". */
  method?: string;
  /** Endpoint shown in the header, e.g. "/v1/rates". */
  endpoint?: string;
  /** Environment badge, e.g. "Sandbox". */
  environment?: string;
  /** Footer link into the docs. */
  docsLink?: DocsLink;
}

/* ------------------------------------------------------------------ */
/* Tokenizer                                                           */
/* ------------------------------------------------------------------ */

type TokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'flag'
  | 'variable'
  | 'url'
  | 'property';

interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS = new Set([
  'const', 'let', 'var', 'await', 'async', 'function', 'return', 'new',
  'import', 'from', 'true', 'false', 'null', 'curl', 'print', 'print_r',
  'None', 'True', 'False',
]);

// Order matters only for matches that start at the same position.
// 1 url  2 comment  3 string  4 $variable  5 number  6 -flag  7 identifier
const TOKEN_RE =
  /(https?:\/\/[^\s"'`\\]+)|(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\$[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|(\s-[A-Za-z]\b)|(\b[A-Za-z_]\w*\b)/g;

const KEY_FOLLOW_RE = /^\s*(?::(?!:)|=>)/;

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let last = 0;

  for (const m of src.matchAll(TOKEN_RE)) {
    const start = m.index ?? 0;
    const text = m[0];
    if (start > last) {
      out.push({ type: 'plain', text: src.slice(last, start) });
    }

    let type: TokenType = 'plain';
    if (m[1]) type = 'url';
    else if (m[2]) type = 'comment';
    else if (m[3]) type = 'string';
    else if (m[4]) type = 'variable';
    else if (m[5]) type = 'number';
    else if (m[6]) type = 'flag';
    else if (m[7]) type = KEYWORDS.has(m[7]) ? 'keyword' : 'plain';

    if (
      (type === 'string' || type === 'plain') &&
      KEY_FOLLOW_RE.test(src.slice(start + text.length))
    ) {
      type = 'property';
    }

    out.push({ type, text });
    last = start + text.length;
  }

  if (last < src.length) {
    out.push({ type: 'plain', text: src.slice(last) });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type CopyState = 'idle' | 'copied' | 'failed';

export default function CodeTabs({
  tabs,
  defaultTab = 0,
  method,
  endpoint,
  environment,
  docsLink,
}: Props) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (!tabs.length) return null;

  const index = Math.min(active, tabs.length - 1);
  const current = tabs[index] as CodeTab;
  const tokens = tokenize(current.code);

  const select = (next: number) => {
    const bounded = (next + tabs.length) % tabs.length;
    setActive(bounded);
    tabRefs.current[bounded]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        select(index + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        select(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        select(0);
        break;
      case 'End':
        event.preventDefault();
        select(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(current.code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    timer.current = setTimeout(() => setCopyState('idle'), 1800);
  };

  const hasHeader = Boolean(method || endpoint || environment);
  const copyLabel =
    copyState === 'copied' ? 'Copied ✓' : copyState === 'failed' ? 'Press Ctrl+C' : 'Copy';

  return (
    <div className={styles.wrap}>
      {hasHeader && (
        <div className={styles.header}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.request}>
            {method && <span className={styles.method}>{method}</span>}
            {endpoint && <span className={styles.endpoint}>{endpoint}</span>}
          </span>
          {environment && (
            <span className={styles.env}>
              <span className={styles.envDot} aria-hidden="true" />
              {environment}
            </span>
          )}
        </div>
      )}

      <div className={styles.tabBar}>
        <div className={styles.tabs} role="tablist" aria-label="Code language">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === index ? 0 : -1}
              className={`${styles.tab} ${i === index ? styles.active : ''}`}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}>
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={copy}
          aria-label={`Copy ${current.label} code`}>
          {copyLabel}
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {copyState === 'copied' ? 'Code copied to clipboard' : ''}
        </span>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}>
        <pre className={styles.pre} tabIndex={0}>
          <code className={styles.code} data-language={current.language}>
            {tokens.map((t, i) =>
              t.type === 'plain' ? (
                t.text
              ) : (
                <span key={i} className={styles[t.type]}>
                  {t.text}
                </span>
              ),
            )}
          </code>
        </pre>
      </div>

      {docsLink && (
        <div className={styles.footer}>
          <span className={styles.footNote}>Example key is masked and illustrative.</span>
          <Link className={styles.footLink} to={docsLink.to}>
            {docsLink.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}