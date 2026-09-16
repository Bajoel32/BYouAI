/**
 * English copy. Must match the shape of `Dictionary` (derived from `id.ts`).
 *
 * Same scope caveat as `id.ts`: the interactive demos are not translated yet
 * and will still render Indonesian under `/en`.
 */

import type { Dictionary } from "./id";

const SITE = "https://byouai.com";

export const en: Dictionary = {
  site: SITE,

  common: {
    skipToContent: "Skip to content",
    lastUpdated: "Last updated",
  },

  meta: {
    titleDefault: "BYouAI — custom RAG-based AI for your business",
    titleTemplate: "%s · BYouAI",
    description:
      "BYouAI builds RAG-based AI assistants and agents on top of your own data — for e-commerce, law firms, medical practices, and other industries. Accurate, cited, production-ready.",
    keywords: [
      "custom AI",
      "RAG",
      "retrieval augmented generation",
      "AI agent",
      "enterprise chatbot",
      "AI for business",
      "e-commerce AI",
      "law firm AI",
    ],
    ogTitle: "BYouAI — custom RAG-based AI",
    ogDescription:
      "AI assistants & agents on top of your own data. Accurate, cited, production-ready.",
    twitterTitle: "BYouAI — custom RAG-based AI",
    twitterDescription: "AI assistants & agents on top of your own data.",
    pages: {
      solusi: {
        title: "Solutions",
        description:
          "Custom AI agents for e-commerce, law firms, clinics, and other industries — built on top of your data and workflows.",
      },
      caraKerja: {
        title: "How It Works",
        description:
          "From raw data to trusted answers: connect data, index & understand, RAG + reasoning, then deploy & monitor.",
      },
      keamanan: {
        title: "Security",
        description:
          "AES-256 encryption, per-client isolation, on-prem/VPC options, SSO/RBAC/audit logs — enterprise security standards.",
      },
      harga: {
        title: "Pricing",
        description:
          "Pilot, Growth, and Enterprise plans. Start small, prove it, then scale — every plan includes source citations and full data control.",
      },
      faq: {
        title: "FAQ",
        description:
          "Common questions about data security, model choice, implementation time, and how answer accuracy is maintained.",
      },
      fitur: {
        title: "Capabilities",
        description:
          "Production-ready knowledge-based AI infrastructure — ready-made RAG, model-agnostic, guardrails, observability, data control.",
      },
      tentang: {
        title: "About",
        description:
          "BYouAI builds RAG-based AI assistants and agents on top of your own business data — accurate, cited, and production-ready.",
      },
      konsultasi: {
        title: "Consultation",
        description:
          "Tell the BYouAI assistant what you need — scope, data, and a cost estimate for custom RAG-based AI on top of your own data.",
      },
      solusiEcommerce: {
        title: "E-commerce Solutions",
        description:
          "An AI agent for online stores — answers in real time from your catalog, stock, pricing, and return policy, with actions into your store's API and handoff to your CS team.",
      },
      privasi: {
        title: "Privacy Policy",
        description:
          "How BYouAI collects, uses, and protects personal data across its site and services.",
      },
      ketentuan: {
        title: "Terms of Service",
        description:
          "Terms for using the BYouAI website and the general framework for service engagements.",
      },
      pemrosesanData: {
        title: "Data Processing",
        description:
          "Summary of the BYouAI Data Processing Addendum: roles, scope, security, subprocessors, and audit rights.",
      },
      invoice: {
        title: "Invoice",
        description: "BYouAI internal invoice generator.",
      },
    },
  },

  nav: {
    home: "BYouAI — home",
    links: [
      { href: "/solusi", label: "Solutions" },
      { href: "/cara-kerja", label: "How It Works" },
      { href: "/keamanan", label: "Security" },
      { href: "/harga", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/invoice", label: "Estimate" },
    ],
    cta: "Consultation",
    ctaMobile: "Free consultation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langLabel: "Change language",
  },

  themeToggle: {
    label: "Theme",
    current: "Current theme",
    switchTo: "Switch to",
    modes: {
      system: "system",
      light: "light",
      dark: "dark",
    },
  },

  footer: {
    tagline:
      "Custom RAG-based AI on top of your own data. Accurate, cited, production-ready.",
    rights: "All rights reserved.",
    madeIn: "Made in Indonesia",
    columns: [
      {
        title: "Product",
        links: [
          { label: "How It Works", href: "/cara-kerja" },
          { label: "Capabilities", href: "/fitur" },
          { label: "Security", href: "/keamanan" },
          { label: "Pricing", href: "/harga" },
          { label: "Estimate", href: "/invoice" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "E-commerce", href: "/solusi/e-commerce" },
          { label: "Law Firms", href: "/solusi/firma-hukum" },
          { label: "Clinics & Doctors", href: "/solusi/klinik-dokter" },
          { label: "Other industries", href: "/konsultasi?industri=lainnya" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/tentang" },
          { label: "Consultation", href: "/konsultasi" },
          { label: "Contact", href: "mailto:halo@byouai.com" },
          { label: "Careers", href: "mailto:karier@byouai.com" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privasi" },
          { label: "Terms of Service", href: "/ketentuan" },
          { label: "Data Processing", href: "/pemrosesan-data" },
        ],
      },
    ],
  },

  hero: {
    badge: "Custom AI Platform",
    titleBefore: "AI that understands your",
    titleEmphasis: "business",
    titleAfter: "domain.",
    lead: "BYouAI builds RAG-based AI assistants and agents on top of your own data — for e-commerce, law firms, medical practices, and other industries. Accurate, cited, production-ready.",
    ctaPrimary: "Free consultation",
    ctaSecondary: "See how it works →",
    fineprint:
      "End-to-end encryption · Your data never trains public models · On-prem option",
    pipeline: ["Your data", "Vector index", "RAG + LLM", "Answer + citations"],
  },

  trust: {
    caption: "Designed for industry-specific workflows",
    ariaList: "Industries served",
    industries: [
      "E-commerce",
      "Law Firms",
      "Clinics & Doctors",
      "Logistics",
      "Education",
      "Finance",
      "Real Estate",
      "B2B SaaS",
      "Manufacturing",
      "Tourism",
    ],
  },

  cta: {
    titleBefore: "Start with a single use case.",
    titleEmphasis: "See results",
    titleAfter: "in 3 weeks.",
    lead: "Build a plan estimate in one minute, or tell us about your workflow and data — we'll come back with a solution design, at no cost.",
    primary: "Build a plan estimate",
    secondary: "Schedule a consultation",
  },

  features: {
    kicker: "Core Capabilities",
    title: "AI infrastructure you don't have to build yourself",
    lead: "Everything you need to run knowledge-based AI in production — in one platform.",
    items: [
      {
        icon: "bolt",
        title: "Ready-made RAG Function",
        body: "One endpoint: send a question, get a full answer with citations to its source documents. No assembling your own pipeline.",
        wide: true,
      },
      {
        icon: "layers",
        title: "Model-agnostic",
        body: "Claude, GPT, Llama, or a local model. Switch any time without rewriting your application.",
        wide: true,
      },
      {
        icon: "shield",
        title: "Guardrails & evaluation",
        body: "Answer regression tests, hallucination detection, and automatic PII redaction.",
        wide: false,
      },
      {
        icon: "plug",
        title: "Broad integrations",
        body: "Postgres, Notion, Google Drive, Shopify, WhatsApp, Slack, and REST APIs.",
        wide: false,
      },
      {
        icon: "activity",
        title: "Full observability",
        body: "Trace every retrieval, latency, and cost per answer in a single dashboard.",
        wide: false,
      },
      {
        icon: "database",
        title: "Data control",
        body: "Choice of storage region, configurable retention, export and delete any time.",
        wide: false,
      },
    ],
  },

  howItWorks: {
    kicker: "How It Works",
    title: "From raw data to trusted answers",
    lead: "A RAG pipeline with citations at every step — auditable, not a black box.",
    steps: [
      {
        n: "01",
        t: "Connect data",
        d: "Documents, databases, APIs, tickets, email, spreadsheets. We ingest, clean, and map their structure.",
      },
      {
        n: "02",
        t: "Index & understand",
        d: "Chunking, embedding, and an optional knowledge graph. The index updates automatically as your data changes.",
      },
      {
        n: "03",
        t: "RAG + reasoning",
        d: "Hybrid retrieval — keyword and vector — then the LLM of your choice composes the answer. Every answer carries its source.",
      },
      {
        n: "04",
        t: "Deploy & monitor",
        d: "Web widget, REST API, Slack, or WhatsApp. A dashboard for accuracy, latency, and cost per answer.",
      },
    ],
  },

  security: {
    kicker: "Security & Compliance",
    title: "Built to enterprise security standards",
    lead: "The data you hand over is your most sensitive asset. We treat it that way — from infrastructure to contract.",
    items: [
      "AES-256 encryption in transit and at rest",
      "Per-client data isolation — no tenant mixing",
      "On-prem or in-your-VPC deployment options",
      "Your data is not used to train third-party models",
      "SSO, RBAC, and exportable audit logs",
      "Selectable data storage region",
      "Configurable data retention and deletion",
      "Aligned with Indonesia's PDP Law; SOC 2 certification in progress",
    ],
  },

  faq: {
    kicker: "FAQ",
    title: "Frequently asked questions",
    lead: "Not answered here? Write to halo@byouai.com — we reply within 1 business day.",
    items: [
      {
        q: "Is our data safe and private?",
        a: "Yes. Your data is encrypted, isolated per client, and never used to train third-party models. On-prem options and storage-region selection are available.",
      },
      {
        q: "Which AI models do you use?",
        a: "Model-agnostic. You can use Claude, GPT, Llama, or a local model — and swap it any time without rewriting the application.",
      },
      {
        q: "How long does implementation take?",
        a: "A pilot is usually 2–3 weeks. A production version is 6–10 weeks, depending on the number and complexity of data integrations.",
      },
      {
        q: "How is answer accuracy maintained?",
        a: "Hybrid retrieval, source citations on every answer, answer regression tests, hallucination detection, and an optional human-in-the-loop for sensitive cases.",
      },
      {
        q: "Can it run on-premise?",
        a: "Yes. We support deployment on your own servers or inside your VPC, including with local language models.",
      },
      {
        q: "Is Indonesian fully supported?",
        a: "Yes, including mixed Indonesian–English text and the domain-specific terminology of your industry.",
      },
    ],
  },

  solutions: {
    kicker: "Industry Solutions",
    title: "One platform, tailored to how you work",
    lead: "We don't sell generic chatbots. Every solution is built on top of your industry's specific data, rules, and workflows.",
    items: [
      {
        tag: "E-commerce",
        title: "Shopping & customer service agent",
        body: "Answers from your catalog, stock, pricing, and return policy in real time. Product recommendations based on store data, not guesswork.",
        points: [
          "Catalog & inventory sync",
          "Seamless handoff to human agents",
          "Contextual recommendations & upsell",
        ],
        cta: { href: "/solusi/e-commerce", label: "See the workflow & start" },
      },
      {
        tag: "Law Firms",
        title: "Research & document analysis",
        body: "Searches thousands of case files, summarizes contracts, and pulls relevant clauses — every answer includes a citation to its source.",
        points: [
          "Clause extraction & comparison",
          "Layered summaries",
          "Full citation trail",
        ],
        cta: { href: "/solusi/firma-hukum", label: "Try the simulation" },
      },
      {
        tag: "Clinics & Doctors",
        title: "Triage & administration assistant",
        body: "Answers from your clinic's protocols and SOPs. Drafts visit summaries and safely handles routine patient questions.",
        points: [
          "Grounded in internal protocols",
          "Patient data (PII) redaction",
          "Complete audit log",
        ],
        cta: {
          href: "/solusi/klinik-dokter",
          label: "Try the speech-to-text simulation",
        },
      },
    ],
    other: {
      title: "Your industry not listed here?",
      body: "Have unique data and workflows — logistics, education, manufacturing, public services? We design the solution from scratch.",
      cta: "Talk to the team",
    },
  },

  pricing: {
    kicker: "Pricing",
    title: "Start small, prove it, then scale",
    lead: "Pricing is tailored to scope, volume, and integrations. Every plan includes source citations and full data control.",
    popular: "Popular",
    from: "from",
    tiers: {
      pilot: {
        tagline: "Proof of value in 2–3 weeks",
        features: [
          "1 scoped use case",
          "Up to 3 data sources",
          "Initial accuracy evaluation",
          "Feasibility report & recommendations",
        ],
        cta: "Start a pilot",
      },
      growth: {
        tagline: "One use case, production-ready",
        features: [
          "Full data & channel integration",
          "Guardrails & continuous evaluation",
          "Observability dashboard",
          "SLA and priority support",
        ],
        cta: "Request a quote",
      },
      enterprise: {
        tagline: "Multi use case & on-prem",
        features: [
          "On-prem / VPC deployment",
          "SSO, RBAC, audit logs",
          "Local / private models",
          "Dedicated solutions engineer",
        ],
        cta: "Contact the team",
      },
    },
  },

  konsultasi: {
    kicker: "Consultation",
    titleBefore: "Tell us what you need.",
    titleEmphasis: "Get a direction",
    titleAfter: "in minutes.",
    lead: "This assistant answers from BYouAI's knowledge base. Fill in a few details, then ask anything — from scope and data readiness to a cost estimate.",
  },

  solusiEcommerce: {
    kicker: "Solutions · E-commerce",
    titleBefore: "A shopping & customer service agent that",
    titleEmphasis: "knows your store",
    lead: "Built on your catalog, inventory, and store policies — not a generic chatbot. Every answer carries its source, every action connects to the systems you already use.",
  },

  og: {
    title: "AI that understands your business domain.",
    description:
      "RAG-based AI assistants & agents on top of your own data — accurate, cited, production-ready.",
    footer: "E-commerce · Law Firms · Clinics & Doctors · and more",
  },

  docs: {
    tentang: {
      kicker: "About",
      title: "We build AI on top of your data, not another generic chatbot",
      intro:
        "BYouAI is a small team focused on one thing: making an organization's internal knowledge answerable, with answers you can trace back to their source.",
      updated: "",
      body: `
        <h2>What we do</h2>
        <p>We design, build, and operate <strong>retrieval-augmented generation</strong> (RAG) AI assistants and agents on top of the documents, databases, and systems you already use. Every answer carries a citation to its source document, so your team can verify rather than simply trust.</p>
        <h2>Principles</h2>
        <ul>
          <li><strong>Auditable.</strong> Retrieval, citations, latency, and cost per answer are all visible — no black box.</li>
          <li><strong>Your data stays yours.</strong> Never used to train third-party models; you decide the storage region, retention, and deletion.</li>
          <li><strong>Model-agnostic.</strong> Claude, GPT, Llama, or a local model — swappable without rewriting the application.</li>
          <li><strong>Start small.</strong> Prove one use case first, then scale.</li>
        </ul>
        <h2>Get in touch</h2>
        <p>Write to <a href="mailto:halo@byouai.com">halo@byouai.com</a> with an outline of your workflow and data. We'll come back with a solution design and estimate, at no cost. For applications and collaboration: <a href="mailto:karier@byouai.com">karier@byouai.com</a>.</p>
      `,
    },
    privasi: {
      kicker: "Legal",
      title: "Privacy Policy",
      intro:
        "This policy explains how BYouAI handles personal data we receive through this site and while exploring or running a project.",
      updated: "September 2026",
      body: `
        <h2>1. Data we collect</h2>
        <ul>
          <li><strong>Contact data</strong> you send by email or the consultation form: name, email address, company, and message content.</li>
          <li><strong>Technical data</strong> standard to any web server: IP address, browser type, and pages accessed. This site does not use advertising tracking cookies.</li>
        </ul>
        <h2>2. How we use it</h2>
        <p>To respond to your request, prepare a solution design and quote, and keep the site secure and reliable. We do not sell personal data.</p>
        <h2>3. Client project data</h2>
        <p>Data you hand over for an implementation (documents, databases, recordings) is governed by the service agreement and the <a href="/pemrosesan-data">Data Processing Addendum</a>, not by this site policy. Such data is isolated per client and is not used to train third-party models.</p>
        <h2>4. Sharing with third parties</h2>
        <p>We use a number of processors (subprocessors) for hosting, email, and aggregate analytics. They are bound by confidentiality obligations and only process data on our instructions. A current list is available on request.</p>
        <h2>5. Storage and retention</h2>
        <p>Contact data is kept for as long as needed for the business relationship, then deleted or anonymized. You can request earlier deletion at any time.</p>
        <h2>6. Your rights</h2>
        <p>Under the Personal Data Protection Law, you have the right to access, correct, and delete your personal data, and to withdraw consent. Submit a request via <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.</p>
        <h2>7. Changes</h2>
        <p>We may update this policy; the &ldquo;last updated&rdquo; date above always reflects the current version.</p>
      `,
    },
    ketentuan: {
      kicker: "Legal",
      title: "Terms of Service",
      intro:
        "These terms govern use of the byouai.com website. Every paid project is governed by a separate service agreement (MSA/SOW) signed by both parties.",
      updated: "September 2026",
      body: `
        <h2>1. Use of the site</h2>
        <p>Content on this site is provided for general information. You agree not to misuse the site, attempt to access systems without authorization, or disrupt its operation.</p>
        <h2>2. Not a binding offer</h2>
        <p>Product, plan, and timeline descriptions on this site are indicative and do not form a contract. Binding scope, pricing, SLAs, and warranties are only those set out in a signed SOW.</p>
        <h2>3. Intellectual property</h2>
        <p>The brand, logos, and site content belong to BYouAI. You retain ownership of all data and materials you submit in a project; ownership of deliverables is set out in the relevant SOW.</p>
        <h2>4. Third-party links</h2>
        <p>The site may contain links to third-party services that we do not control and do not warrant.</p>
        <h2>5. Limitation of liability</h2>
        <p>To the extent permitted by law, BYouAI is not liable for indirect or consequential losses arising from use of this site.</p>
        <h2>6. Governing law</h2>
        <p>These terms are governed by the law of the Republic of Indonesia. Questions: <a href="mailto:halo@byouai.com">halo@byouai.com</a>.</p>
      `,
    },
    pemrosesanData: {
      kicker: "Legal",
      title: "Data Processing Addendum",
      intro:
        "This summary describes how BYouAI processes client data in an implementation. The full addendum is attached to the service agreement and is binding.",
      updated: "September 2026",
      body: `
        <h2>1. Roles of the parties</h2>
        <p>The client acts as the <strong>data controller</strong>; BYouAI as the <strong>data processor</strong>, processing personal data only on the client's documented instructions.</p>
        <h2>2. Scope and purpose</h2>
        <p>Processing is limited to what is needed to provide the service: ingestion, indexing (chunking and embedding), retrieval, and generating answers with citations. Data is not used for any other purpose and is not used to train third-party foundation models.</p>
        <h2>3. Security</h2>
        <ul>
          <li>AES-256 encryption in transit and at rest.</li>
          <li>Per-client isolation — no tenant mixing.</li>
          <li>Role-based access control (RBAC), SSO, and audit logs.</li>
          <li>Automatic PII redaction on flows configured for it.</li>
          <li>On-prem or in-client-VPC deployment options.</li>
        </ul>
        <h2>4. Subprocessors</h2>
        <p>BYouAI may use subprocessors (e.g. infrastructure and model providers) with equivalent data-protection obligations. A current list and notice of changes are provided per the addendum.</p>
        <h2>5. Data location and transfers</h2>
        <p>The storage region is chosen by the client. Cross-jurisdiction transfers, if any, use a lawful safeguard mechanism.</p>
        <h2>6. Retention and return</h2>
        <p>When the service ends, client data is returned or deleted per the client's instructions within an agreed period, unless retention is required by law.</p>
        <h2>7. Assistance and audit</h2>
        <p>BYouAI assists the client in responding to data-subject requests and incidents, and provides reasonable information to demonstrate compliance. Requests: <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.</p>
      `,
    },
  },
};
