// src/pages/index.tsx
//
// Sprint Connect landing page (Docusaurus).
//
// Navbar and footer come from docusaurus.config; this file owns everything
// between them. Every link points at a route from sidebars.ts. Nothing here
// claims live data, SDKs, webhooks, uptime, certifications or pricing.
//
// Destinations are collected in ROUTES so they can be changed in one place.

import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeTabs, { type CodeTab } from '@site/src/components/CodeTabs';
import SprintMap from '@site/src/components/SprintMap';
import { BulkVisual, LagosVisual } from '@site/src/components/FeatureVisuals';
import useReducedMotion from '@site/src/hooks/useReducedMotion';
import styles from './index.module.css';

/* ------------------------------------------------------------------ */
/* Configurable destinations                                           */
/* ------------------------------------------------------------------ */

const ROUTES = {
  getKeys: '/docs/sandbox/get-a-sandbox-key',
  intro: '/docs/intro',
  quickstart: '/docs/quickstart',
  authentication: '/docs/authentication',
  environments: '/docs/environments',
  quoteLifecycle: '/docs/quote-lifecycle',
  idempotency: '/docs/idempotency',
  firstQuote: '/docs/sandbox/your-first-rate-quote',
  firstShipment: '/docs/sandbox/your-first-shipment',
  failureCases: '/docs/sandbox/testing-failure-cases',
  singleShipment: '/docs/guides/send-a-single-shipment',
  bulkBatch: '/docs/guides/send-a-bulk-batch',
  localDeliveries: '/docs/guides/local-deliveries',
  trackShipment: '/docs/guides/track-a-shipment',
  errors: '/docs/guides/errors',
  ratesCreate: '/docs/api/rates-create',
  shipmentsCreate: '/docs/api/shipments-create',
  catchup: '/docs/api/shipments-catchup-list',
  trackingRead: '/docs/api/tracking-read',
} as const;

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const CODE_TABS: CodeTab[] = [
  {
    label: 'cURL',
    language: 'bash',
    code: `curl -X POST https://api.sprintafrica.com.ng/v1/rates \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0
  }'`,
  },
  {
    label: 'Node.js',
    language: 'javascript',
    code: `const res = await fetch(
  'https://api.sprintafrica.com.ng/v1/rates',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer sk_test_...',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin_state: 'Lagos',
      destination_state: 'Rivers',
      weight_kg: 2.0,
    }),
  },
);
const quote = await res.json();
console.log(quote);`,
  },
  {
    label: 'Python',
    language: 'python',
    code: `import requests

r = requests.post(
    'https://api.sprintafrica.com.ng/v1/rates',
    headers={'Authorization': 'Bearer sk_test_...'},
    json={
        'origin_state': 'Lagos',
        'destination_state': 'Rivers',
        'weight_kg': 2.0,
    },
)
print(r.json())`,
  },
  {
    label: 'PHP',
    language: 'php',
    code: `<?php
$ch = curl_init('https://api.sprintafrica.com.ng/v1/rates');
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER     => [
    'Authorization: Bearer sk_test_...',
    'Content-Type: application/json',
  ],
  CURLOPT_POSTFIELDS => json_encode([
    'origin_state'      => 'Lagos',
    'destination_state' => 'Rivers',
    'weight_kg'         => 2.0,
  ]),
]);
$quote = json_decode(curl_exec($ch), true);
print_r($quote);`,
  },
];

interface Step {
  n: string;
  title: string;
  body: string;
  to: string;
  cta: string;
}

const STEPS: ReadonlyArray<Step> = [
  {
    n: '01',
    title: 'Get your API keys',
    body: 'Start in the sandbox with a test key. Test and live are separate environments.',
    to: ROUTES.getKeys,
    cta: 'Get a sandbox key',
  },
  {
    n: '02',
    title: 'Request a quote',
    body: 'Send origin, destination and package details to the rates endpoint.',
    to: ROUTES.firstQuote,
    cta: 'Your first quote',
  },
  {
    n: '03',
    title: 'Create a shipment',
    body: 'Use a valid quote and the required shipment details to create the shipment.',
    to: ROUTES.firstShipment,
    cta: 'Your first shipment',
  },
  {
    n: '04',
    title: 'Track delivery',
    body: 'Retrieve the shipment and follow its tracking events through to delivery.',
    to: ROUTES.trackShipment,
    cta: 'Track a shipment',
  },
];

interface Capability {
  title: string;
  tag: string;
  body: string;
  to: string;
}

const CAPABILITIES: ReadonlyArray<Capability> = [
  {
    title: 'Rate quotes',
    tag: 'POST /v1/rates',
    body: 'Price a shipment by origin state, destination state and weight before you commit to it.',
    to: ROUTES.ratesCreate,
  },
  {
    title: 'Shipment creation',
    tag: 'api/shipments-create',
    body: 'Create shipments from your own backend, against a quote.',
    to: ROUTES.shipmentsCreate,
  },
  {
    title: 'Shipment tracking',
    tag: 'api/tracking-read',
    body: 'Read tracking for a shipment so your customers can follow it.',
    to: ROUTES.trackingRead,
  },
  {
    title: 'Event catch-up',
    tag: 'api/shipments-catchup-list',
    body: 'List shipment events so your system can catch up after downtime.',
    to: ROUTES.catchup,
  },
  {
    title: 'Idempotent creation',
    tag: 'concepts/idempotency',
    body: 'Retry shipment creation safely, without creating duplicates.',
    to: ROUTES.idempotency,
  },
  {
    title: 'Bulk endpoints',
    tag: 'guides/send-a-bulk-batch',
    body: 'Interstate and local bulk rate and shipment endpoints for larger volumes.',
    to: ROUTES.bulkBatch,
  },
  {
    title: 'Test and live environments',
    tag: 'concepts/environments',
    body: 'Build against the sandbox, then switch to live when you are ready.',
    to: ROUTES.environments,
  },
  {
    title: 'Error handling',
    tag: 'guides/errors',
    body: 'Documented error responses, and sandbox cases for testing failures.',
    to: ROUTES.errors,
  },
];

interface Control {
  title: string;
  body: string;
  to: string;
}

const CONTROLS: ReadonlyArray<Control> = [
  {
    title: 'API key authentication',
    body: 'Every request carries a Bearer key. Keys stay on your server.',
    to: ROUTES.authentication,
  },
  {
    title: 'Separate environments',
    body: 'Test keys and live keys are distinct, so experiments stay out of production.',
    to: ROUTES.environments,
  },
  {
    title: 'Idempotency',
    body: 'Safe retries for shipment creation when a network call fails midway.',
    to: ROUTES.idempotency,
  },
  {
    title: 'Structured errors',
    body: 'Errors are documented and testable in the sandbox before you go live.',
    to: ROUTES.errors,
  },
];

const DOC_NAV: ReadonlyArray<{ label: string; to: string; current?: boolean }> = [
  { label: 'Introduction', to: ROUTES.intro },
  { label: 'Quickstart', to: ROUTES.quickstart },
  { label: 'Authentication', to: ROUTES.authentication },
  { label: 'Environments', to: ROUTES.environments },
  { label: 'Rate quotes', to: ROUTES.ratesCreate, current: true },
  { label: 'Shipments', to: ROUTES.shipmentsCreate },
  { label: 'Tracking', to: ROUTES.trackingRead },
  { label: 'Bulk deliveries', to: ROUTES.bulkBatch },
  { label: 'Error handling', to: ROUTES.errors },
];

const PARAMS: ReadonlyArray<{ name: string; type: string; note: string }> = [
  { name: 'origin_state', type: 'string', note: 'State the package is collected from.' },
  { name: 'destination_state', type: 'string', note: 'State the package is delivered to.' },
  { name: 'weight_kg', type: 'number', note: 'Package weight in kilograms.' },
];

interface UseCase {
  title: string;
  body: string;
  flow: ReadonlyArray<string>;
}

const USE_CASES: ReadonlyArray<UseCase> = [
  {
    title: 'E-commerce platforms',
    body: 'Show a delivery quote at checkout, create the shipment when the order is paid, and surface tracking on the order page.',
    flow: ['Checkout', 'Quote', 'Shipment', 'Tracking'],
  },
  {
    title: 'Online marketplaces',
    body: 'Let sellers ship from their own state while your platform keeps one integration and one place to follow every order.',
    flow: ['Seller order', 'Quote', 'Shipment', 'Tracking'],
  },
  {
    title: 'Retail and distribution',
    body: 'Group outgoing orders into bulk batches from your warehouse and keep track of each package inside them.',
    flow: ['Warehouse', 'Bulk batch', 'Shipments', 'Delivered'],
  },
  {
    title: 'Custom business applications',
    body: 'Add delivery to an internal tool or an operations dashboard with a few authenticated REST calls.',
    flow: ['Your app', 'REST call', 'Shipment', 'Events'],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type RevealState = 'visible' | 'hidden' | 'shown';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll reveal that is safe for SSR and reduced motion: content renders
 * visible, and is only hidden after hydration if it is below the fold.
 */
function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [state, setState] = useState<RevealState>('visible');

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      return undefined;
    }
    setState('hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const stateClass =
    state === 'hidden' ? styles.revealHidden : state === 'shown' ? styles.revealShown : '';

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${stateClass} ${className ?? ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
}

function SectionHead({ eyebrow, title, lead, align = 'left' }: SectionHeadProps) {
  return (
    <div className={`${styles.sectionHead} ${align === 'center' ? styles.center : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.h2}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}

function ArrowLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link className={styles.arrowLink} to={to}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} aria-hidden="true" />
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>LOGISTICS INFRASTRUCTURE FOR BUILDERS</p>
          <h1 className={styles.heroTitle}>
            Move anything across Nigeria with{' '}
            <span className={styles.heroAccent}>one API.</span>
          </h1>
          <p className={styles.heroLead}>
            Integrate nationwide delivery into your application. Generate rate quotes,
            create shipments, track packages, and manage bulk deliveries through a
            single API.
          </p>
          <div className={styles.ctaRow}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to={ROUTES.getKeys}>
              Get your API keys
            </Link>
            <Link className={`${styles.btn} ${styles.btnGhost}`} to={ROUTES.intro}>
              Explore the documentation <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={styles.trust}>
            <li>Sandbox and live environments</li>
            <li>REST API</li>
            <li>Developer-first integration</li>
          </ul>
        </div>

        <div className={styles.heroVisual}>
          <SprintMap />
        </div>
      </div>
    </header>
  );
}

function Playground() {
  return (
    <section className={styles.section} aria-labelledby="playground-title">
      <div className={styles.container}>
        <div className={styles.split}>
          <Reveal>
            <p className={styles.eyebrow}>THE API</p>
            <h2 id="playground-title" className={styles.h2}>
              Your logistics infrastructure starts with one request.
            </h2>
            <p className={styles.lead}>
              See how a single API call can generate a delivery quote for your
              application. Same request, in the language your team already uses.
            </p>
            <ul className={styles.checks}>
              <li>One key, one base URL</li>
              <li>Origin state, destination state and weight in, quote out</li>
              <li>Sandbox keys start with <code>sk_test_</code></li>
            </ul>
            <ArrowLink to={ROUTES.firstQuote}>Make your first sandbox quote</ArrowLink>
          </Reveal>

          <Reveal delay={120}>
            <CodeTabs
              tabs={CODE_TABS}
              method="POST"
              endpoint="/v1/rates"
              environment="Sandbox"
              docsLink={{ label: 'See the response schema', to: ROUTES.ratesCreate }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="features-title">
      <div className={styles.container}>
        <Reveal>
          <SectionHead
            eyebrow="CAPABILITIES"
            title="One integration, three ways to ship."
            lead="Local, interstate and bulk deliveries all share the same authentication and the same quote-first flow."
          />
        </Reveal>
        <span id="features-title" className={styles.srOnly}>Core product capabilities</span>

        <div className={styles.feature}>
          <Reveal className={styles.featureCopy}>
            <p className={styles.featureTag}>A · SAME-DAY LAGOS</p>
            <h3 className={styles.h3}>Local delivery, built for Lagos.</h3>
            <p className={styles.lead}>
              Generate delivery quotes for supported Lagos locations and integrate
              same-day fulfilment into your existing business workflow.
            </p>
            <ArrowLink to={ROUTES.localDeliveries}>Read the local deliveries guide</ArrowLink>
          </Reveal>
          <Reveal delay={120}>
            <LagosVisual />
          </Reveal>
        </div>

        <div className={`${styles.feature} ${styles.featureFlip}`}>
          <Reveal className={styles.featureCopy}>
            <p className={styles.featureTag}>B · NEXT-DAY INTERSTATE</p>
            <h3 className={styles.h3}>Nationwide reach. One integration.</h3>
            <p className={styles.lead}>
              Connect interstate shipping to your application, from rate quotes and
              shipment creation to tracking and hub checkpoints.
            </p>
            <ArrowLink to={ROUTES.singleShipment}>Send a single shipment</ArrowLink>
          </Reveal>
          <Reveal delay={120}>
            <SprintMap variant="network" />
          </Reveal>
        </div>

        <div className={styles.feature}>
          <Reveal className={styles.featureCopy}>
            <p className={styles.featureTag}>C · BULK SHIPMENTS</p>
            <h3 className={styles.h3}>Scale from one package to hundreds.</h3>
            <p className={styles.lead}>
              Integrate the supported bulk-delivery endpoints, organise packages into
              batches, and manage shipments through your application.
            </p>
            <ArrowLink to={ROUTES.bulkBatch}>Send a bulk batch</ArrowLink>
          </Reveal>
          <Reveal delay={120}>
            <BulkVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <div className={styles.container}>
        <Reveal>
          <SectionHead
            eyebrow="HOW IT WORKS"
            title="From first key to first delivery."
            lead="Build and test everything in the sandbox. Sandbox shipments are for testing; live keys are what you use in production."
            align="center"
          />
        </Reveal>
        <span id="how-title" className={styles.srOnly}>How it works</span>

        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li key={step.n} className={styles.stepItem}>
              <Reveal delay={i * 80} className={styles.stepInner}>
                <span className={styles.stepNum}>{step.n}</span>
                <h3 className={styles.h4}>{step.title}</h3>
                <p className={styles.small}>{step.body}</p>
                <ArrowLink to={step.to}>{step.cta}</ArrowLink>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DeveloperGrid() {
  return (
    <section className={`${styles.section} ${styles.dark}`} aria-labelledby="dev-title">
      <div className={styles.darkGlow} aria-hidden="true" />
      <div className={styles.container}>
        <Reveal>
          <p className={styles.eyebrow}>DEVELOPER INFRASTRUCTURE</p>
          <h2 id="dev-title" className={styles.h2}>
            Everything your application needs to ship.
          </h2>
          <p className={styles.lead}>
            The documented building blocks, each with its own page in the docs.
          </p>
        </Reveal>

        <ul className={styles.capGrid}>
          {CAPABILITIES.map((cap, i) => (
            <li key={cap.title}>
              <Reveal delay={(i % 4) * 70} className={styles.capReveal}>
                <Link className={styles.capCard} to={cap.to}>
                  <span className={styles.capTag}>{cap.tag}</span>
                  <span className={styles.capTitle}>{cap.title}</span>
                  <span className={styles.capBody}>{cap.body}</span>
                  <span className={styles.capGo} aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reliability() {
  return (
    <section className={styles.section} aria-labelledby="control-title">
      <div className={styles.container}>
        <div className={styles.split}>
          <Reveal>
            <p className={styles.eyebrow}>AUTHENTICATION AND CONTROL</p>
            <h2 id="control-title" className={styles.h2}>
              Integrate with confidence.
            </h2>
            <p className={styles.lead}>
              Clear technical controls, documented in the open. Read how each one
              works before you write a line of integration code.
            </p>
            <div className={styles.snippet}>
              <span className={styles.snippetLabel}>Every request</span>
              <code className={styles.snippetCode}>Authorization: Bearer sk_test_...</code>
            </div>
          </Reveal>

          <ul className={styles.controlGrid}>
            {CONTROLS.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={i * 80} className={styles.controlReveal}>
                  <Link className={`${styles.glass} ${styles.controlCard}`} to={c.to}>
                    <span className={styles.controlTitle}>{c.title}</span>
                    <span className={styles.small}>{c.body}</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DocsPreview() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="docs-title">
      <div className={styles.container}>
        <Reveal>
          <SectionHead
            eyebrow="DOCUMENTATION"
            title="Docs you can actually read."
            lead="Guides for the concepts, and a reference page for every endpoint."
            align="center"
          />
        </Reveal>
        <span id="docs-title" className={styles.srOnly}>Documentation preview</span>

        <Reveal delay={100}>
          <div className={`${styles.glass} ${styles.docs}`}>
            <nav className={styles.docsNav} aria-label="Documentation sections (preview)">
              {DOC_NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`${styles.docsNavLink} ${item.current ? styles.docsNavCurrent : ''}`}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <article className={styles.docsMain}>
              <p className={styles.eyebrow}>API REFERENCE</p>
              <h3 className={styles.h3}>Create a rate quote</h3>
              <p className={styles.small}>
                Request a delivery quote for a package travelling between two states.
                A quote is the starting point for creating a shipment.
              </p>
              <h4 className={styles.docsSub}>Body parameters</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {PARAMS.map((p) => (
                    <tr key={p.name}>
                      <td><code>{p.name}</code></td>
                      <td>{p.type}</td>
                      <td>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <aside className={styles.docsAside} aria-label="Endpoint reference">
              <p className={styles.asideLabel}>ENDPOINT</p>
              <p className={styles.endpointRow}>
                <span className={styles.method}>POST</span>
                <code>/v1/rates</code>
              </p>
              <p className={styles.asideLabel}>AUTHENTICATION</p>
              <p className={styles.small}>Bearer API key</p>
              <p className={styles.asideLabel}>RESPONSES</p>
              <p className={styles.small}>Response codes are listed in the API reference.</p>
              <ArrowLink to={ROUTES.ratesCreate}>Full reference</ArrowLink>
            </aside>
          </div>
        </Reveal>

        <div className={`${styles.ctaRow} ${styles.ctaCenter}`}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} to={ROUTES.intro}>
            Explore the documentation <span aria-hidden="true">→</span>
          </Link>
          <Link className={`${styles.btn} ${styles.btnGhost}`} to={ROUTES.quickstart}>
            Start with the quickstart
          </Link>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className={styles.section} aria-labelledby="use-title">
      <div className={styles.container}>
        <Reveal>
          <SectionHead
            eyebrow="SOLUTIONS"
            title="Fits the product you already run."
            lead="Delivery becomes another step in your existing workflow."
          />
        </Reveal>
        <span id="use-title" className={styles.srOnly}>Solutions and use cases</span>

        <ul className={styles.useGrid}>
          {USE_CASES.map((u, i) => (
            <li key={u.title}>
              <Reveal delay={(i % 2) * 90} className={styles.useReveal}>
                <div className={`${styles.glass} ${styles.useCard}`}>
                  <h3 className={styles.h4}>{u.title}</h3>
                  <p className={styles.small}>{u.body}</p>
                  <ol className={styles.flow} aria-label={`${u.title} flow`}>
                    {u.flow.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="pricing-title">
      <div className={styles.container}>
        <Reveal>
          <div className={`${styles.glass} ${styles.pricing}`}>
            <div>
              <p className={styles.eyebrow}>PRICING</p>
              <h2 id="pricing-title" className={styles.h2}>
                Quotes come from the API.
              </h2>
              <p className={styles.lead}>
                Delivery charges depend on the shipment. Request a quote for any lane
                and weight through the rates endpoint to see what applies. Start in
                the sandbox with no commitment to production.
              </p>
            </div>
            <div className={styles.pricingCta}>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to={ROUTES.getKeys}>
                Get a sandbox key
              </Link>
              <ArrowLink to={ROUTES.quoteLifecycle}>How quotes work</ArrowLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="final-title">
      <div className={styles.finalBg} aria-hidden="true">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className={styles.finalSvg}>
          <path d="M0 150 Q200 20 400 100 T800 60" className={styles.finalRoute} />
          <circle cx="400" cy="100" r="5" className={styles.finalDot} />
        </svg>
      </div>
      <div className={`${styles.container} ${styles.finalInner}`}>
        <Reveal>
          <h2 id="final-title" className={styles.finalTitle}>
            Your next delivery integration starts here.
          </h2>
          <p className={styles.finalLead}>
            Build, test, and integrate Sprint Connect into your application.
          </p>
          <div className={`${styles.ctaRow} ${styles.ctaCenter}`}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to={ROUTES.getKeys}>
              Get your API keys
            </Link>
            <Link className={`${styles.btn} ${styles.btnGhost}`} to={ROUTES.intro}>
              Read the documentation
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <Layout
      title="Sprint Connect API"
      description="The merchant-facing API for Sprint Africa. Ship across Nigeria with one key.">
      <div className={styles.page}>
        <Hero />
        <main>
          <Playground />
          <Features />
          <HowItWorks />
          <DeveloperGrid />
          <Reliability />
          <DocsPreview />
          <UseCases />
          <Pricing />
          <FinalCta />
        </main>
      </div>
    </Layout>
  );
}