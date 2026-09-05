"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Radio,
  RotateCcw,
  Search,
  SendHorizontal,
  ShieldAlert,
  ShieldCheck,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Shared chat + RAG-inspector sandbox shell.
 *
 * Drives a scripted "chat on the left, RAG inspector on the right" simulation:
 * preset scenario buttons play a staged sequence (inspector steps → typing →
 * answer + widget + citations + guardrail tags), and a free-text box either
 * replies with a fallback or, via `classifyFreeText`, refuses and shows a
 * blocked inspector state. No network — everything is scripted with cancellable
 * timers.
 *
 * Callers supply a `RagSandboxConfig` (see ecommerce-chat-sandbox.tsx and
 * clinic-admin-simulation.tsx). Dark-only and theme-independent.
 */

// ---- Public config ---------------------------------------------------

export type SandboxCitation = { label: string; sub?: string };

export type InspectorData = {
  source: string;
  latencyMs: number;
  matchScore: string;
  apiCall: string;
  chunks: { file: string; score: number }[];
};

export type SandboxScenario = {
  id: string;
  label: string;
  icon: LucideIcon;
  userMessage: string;
  steps: string[];
  inspector: InspectorData;
  ai: {
    text: string;
    citations?: SandboxCitation[];
    guardrails?: string[];
    /** Key handed to `config.renderWidget`. */
    widget?: string;
  };
};

export type FreeTextResult =
  | { kind: "reply"; text: string }
  | {
      kind: "blocked";
      text: string;
      /** Amber chip under the refusal bubble. */
      badge?: string;
      inspectorTitle: string;
      steps: string[];
    };

export type AccentName = "emerald" | "teal";

export type RagSandboxConfig = {
  accent: AccentName;
  header: { icon: LucideIcon; title: string; subtitle: string };
  greeting: string;
  scenarios: SandboxScenario[];
  inputPlaceholder: string;
  inspectorTitle: string;
  /** Inspector body text before any scenario runs. */
  idleHint: string;
  labels: { matchScore: string; apiTrigger: string };
  /** Leading text before citation chips, e.g. "Data tersitasi". */
  citationLabel?: string;
  /** Reply for free-text input when `classifyFreeText` is absent or returns `reply`. */
  fallbackReply: string;
  classifyFreeText?: (q: string) => FreeTextResult;
  renderWidget?: (widget: string) => React.ReactNode;
  /** Pinned to the bottom of the inspector column in every phase. */
  inspectorFooter?: React.ReactNode;
};

// ---- Accent class bundles (Tailwind needs literal class names) ------

type Accent = {
  iconChip: string;
  userBubble: string;
  aiIcon: string;
  scenActive: string;
  scenIcon: string;
  focusBorder: string;
  sendBtn: string;
  dot: string;
  radio: string;
  stepNum: string;
  scoreText: string;
  apiText: string;
  citeIcon: string;
};

const ACCENTS: Record<AccentName, Accent> = {
  emerald: {
    iconChip: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
    userBubble: "border-emerald-500/25 bg-emerald-500/10 text-emerald-50",
    aiIcon: "text-emerald-400",
    scenActive: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    scenIcon: "text-emerald-400",
    focusBorder: "focus:border-emerald-500/40",
    sendBtn: "bg-emerald-500 text-emerald-950",
    dot: "bg-emerald-400",
    radio: "text-emerald-400",
    stepNum: "text-emerald-500/70",
    scoreText: "text-emerald-400",
    apiText: "text-emerald-300",
    citeIcon: "text-emerald-400",
  },
  teal: {
    iconChip: "bg-teal-500/15 text-teal-300 ring-teal-500/25",
    userBubble: "border-teal-500/25 bg-teal-500/10 text-teal-50",
    aiIcon: "text-teal-300",
    scenActive: "border-teal-500/40 bg-teal-500/15 text-teal-200",
    scenIcon: "text-teal-300",
    focusBorder: "focus:border-teal-500/40",
    sendBtn: "bg-teal-500 text-teal-950",
    dot: "bg-teal-400",
    radio: "text-teal-300",
    stepNum: "text-teal-400/70",
    scoreText: "text-teal-300",
    apiText: "text-teal-300",
    citeIcon: "text-teal-300",
  },
};

// ---- Internal state -------------------------------------------------

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "ai";
      text: string;
      citations?: SandboxCitation[];
      guardrails?: string[];
      widget?: string;
      escalated?: boolean;
      badge?: string;
    };

type Phase = "idle" | "running" | "done" | "blocked";

type InspectorState = {
  phase: Phase;
  scenarioId: string | null;
  steps: string[];
  data: InspectorData | null;
  guardrails: string[];
  blockedTitle?: string;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const T = { firstStep: 250, step: 330, preType: 280, type: 1200 };

const IDLE_INSPECTOR: InspectorState = {
  phase: "idle",
  scenarioId: null,
  steps: [],
  data: null,
  guardrails: [],
};

const makeGreeting = (text: string): ChatMessage => ({
  id: "greeting",
  role: "ai",
  text,
});

/** Minimal `**bold**` renderer for the scripted answers. */
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// ---- Component ----------------------------------------------------

export function RagSandbox({ config }: { config: RagSandboxConfig }) {
  const a = ACCENTS[config.accent];
  const HeaderIcon = config.header.icon;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    makeGreeting(config.greeting),
  ]);
  const [typing, setTyping] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [inspector, setInspector] = useState<InspectorState>(IDLE_INSPECTOR);
  const [mobileTab, setMobileTab] = useState<"chat" | "inspector">("chat");
  const [draft, setDraft] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const runRef = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          timers.current.delete(t);
          resolve();
        }, ms);
        timers.current.add(t);
      }),
    [],
  );

  // Cancel every pending step + invalidate the running sequence on unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      runRef.current += 1;
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const runScenario = useCallback(
    async (s: SandboxScenario) => {
      const myRun = (runRef.current += 1);
      const alive = () => runRef.current === myRun;

      setRunningId(s.id);
      setTyping(false);
      setMobileTab("chat");
      setMessages((m) => [...m, { id: uid(), role: "user", text: s.userMessage }]);
      setInspector({
        phase: "running",
        scenarioId: s.id,
        steps: [],
        data: s.inspector,
        guardrails: s.ai.guardrails ?? [],
      });

      for (let i = 0; i < s.steps.length; i += 1) {
        await wait(i === 0 ? T.firstStep : T.step);
        if (!alive()) return;
        setInspector((prev) =>
          prev.scenarioId === s.id
            ? { ...prev, steps: s.steps.slice(0, i + 1) }
            : prev,
        );
      }

      await wait(T.preType);
      if (!alive()) return;
      setTyping(true);
      await wait(T.type);
      if (!alive()) return;
      setTyping(false);

      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "ai",
          text: s.ai.text,
          citations: s.ai.citations,
          guardrails: s.ai.guardrails,
          widget: s.ai.widget,
        },
      ]);
      setInspector((prev) =>
        prev.scenarioId === s.id ? { ...prev, phase: "done" } : prev,
      );
      setRunningId(null);
    },
    [wait],
  );

  const reset = useCallback(() => {
    runRef.current += 1;
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setMessages([makeGreeting(config.greeting)]);
    setTyping(false);
    setRunningId(null);
    setDraft("");
    setInspector(IDLE_INSPECTOR);
  }, [config.greeting]);

  const onSubmitDraft = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = draft.trim();
      if (!q || runningId) return;
      setDraft("");
      setMessages((m) => [...m, { id: uid(), role: "user", text: q }]);

      const res: FreeTextResult = config.classifyFreeText
        ? config.classifyFreeText(q)
        : { kind: "reply", text: config.fallbackReply };

      if (res.kind === "blocked") {
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "ai",
            text: res.text,
            escalated: true,
            badge: res.badge,
          },
        ]);
        setInspector({
          phase: "blocked",
          scenarioId: null,
          steps: res.steps,
          data: null,
          guardrails: [],
          blockedTitle: res.inspectorTitle,
        });
      } else {
        setMessages((m) => [...m, { id: uid(), role: "ai", text: res.text }]);
      }
    },
    [draft, runningId, config],
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid h-7 w-7 place-items-center rounded-lg ring-1 ring-inset",
              a.iconChip,
            )}
          >
            <HeaderIcon className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{config.header.title}</p>
            <p className="text-[11px] text-zinc-500">{config.header.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Ulangi
        </button>
      </div>

      {/* Mobile view switch */}
      <div className="flex gap-1 border-b border-zinc-800 bg-zinc-900/30 p-1.5 lg:hidden">
        {(["chat", "inspector"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setMobileTab(t)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              mobileTab === t
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {t === "chat" ? "Chat" : config.inspectorTitle}
            {t === "inspector" && inspector.phase === "running" ? (
              <span
                className={cn(
                  "ml-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full align-middle",
                  a.dot,
                )}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ---- Chat column ---- */}
        <div
          className={cn(
            "flex-col",
            mobileTab === "chat" ? "flex" : "hidden",
            "lg:flex",
          )}
        >
          <div className="flex flex-wrap gap-2 border-b border-zinc-800 p-3">
            {config.scenarios.map((s) => (
              <ScenarioButton
                key={s.id}
                a={a}
                scenario={s}
                disabled={runningId !== null}
                active={runningId === s.id}
                onClick={() => runScenario(s)}
              />
            ))}
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
            style={{ minHeight: "22rem", maxHeight: "30rem" }}
          >
            {messages.map((m) => (
              <ChatRow
                key={m.id}
                a={a}
                message={m}
                citationLabel={config.citationLabel}
                renderWidget={config.renderWidget}
              />
            ))}
            {typing ? <TypingRow a={a} /> : null}
          </div>

          <form
            onSubmit={onSubmitDraft}
            className="flex items-center gap-2 border-t border-zinc-800 p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Tulis pesan"
              placeholder={config.inputPlaceholder}
              className={cn(
                "min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600",
                a.focusBorder,
              )}
            />
            <button
              type="submit"
              aria-label="Kirim"
              disabled={!draft.trim() || runningId !== null}
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40",
                a.sendBtn,
              )}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* ---- Inspector column ---- */}
        <div
          className={cn(
            "border-zinc-800 bg-zinc-900/30 lg:border-l",
            mobileTab === "inspector" ? "block" : "hidden",
            "lg:block",
          )}
        >
          <InspectorPanel
            a={a}
            state={inspector}
            title={config.inspectorTitle}
            idleHint={config.idleHint}
            labels={config.labels}
            footer={config.inspectorFooter}
          />
        </div>
      </div>
    </div>
  );
}

// ---- Chat pieces --------------------------------------------------

function ScenarioButton({
  a,
  scenario,
  disabled,
  active,
  onClick,
}: {
  a: Accent;
  scenario: SandboxScenario;
  disabled: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = scenario.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? a.scenActive
          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100",
        disabled && !active && "cursor-not-allowed opacity-50",
      )}
    >
      {active ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Icon className={cn("h-3.5 w-3.5", a.scenIcon)} />
      )}
      {scenario.label}
    </button>
  );
}

function ChatRow({
  a,
  message,
  citationLabel,
  renderWidget,
}: {
  a: Accent;
  message: ChatMessage;
  citationLabel?: string;
  renderWidget?: (widget: string) => React.ReactNode;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-br-md border px-3.5 py-2 text-sm",
            a.userBubble,
          )}
        >
          {message.text}
        </div>
      </div>
    );
  }

  const hasFooter = Boolean(
    message.citations?.length || message.guardrails?.length || message.escalated,
  );

  return (
    <div className="flex gap-2.5">
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          message.escalated
            ? "bg-amber-500/15 text-amber-300"
            : cn("bg-zinc-800", a.aiIcon),
        )}
      >
        {message.escalated ? (
          <ShieldAlert className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 max-w-[88%] space-y-2">
        <div
          className={cn(
            "rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-sm leading-relaxed",
            message.escalated
              ? "border-amber-500/25 bg-amber-500/[0.06] text-amber-100/90"
              : "border-zinc-800 bg-zinc-900 text-zinc-200",
          )}
        >
          {renderRich(message.text)}
        </div>

        {message.widget && renderWidget ? renderWidget(message.widget) : null}

        {hasFooter ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {citationLabel && message.citations?.length ? (
              <span className="text-[11px] text-zinc-500">{citationLabel}</span>
            ) : null}
            {message.citations?.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-400"
              >
                <FileText className={cn("h-3 w-3", a.citeIcon)} />
                <span className="font-mono text-zinc-300">{c.label}</span>
                {c.sub ? <span className="text-zinc-600">· {c.sub}</span> : null}
              </span>
            ))}
            {message.escalated && message.badge ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300">
                <ShieldAlert className="h-3 w-3" />
                {message.badge}
              </span>
            ) : null}
            {message.guardrails?.map((g) => (
              <GuardrailTag key={g} kind={g} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GuardrailTag({ kind }: { kind: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
      <ShieldCheck className="h-3 w-3" />
      {kind}
    </span>
  );
}

function TypingRow({ a }: { a: Accent }) {
  return (
    <div className="flex gap-2.5">
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-800",
          a.aiIcon,
        )}
      >
        <Bot className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-zinc-800 bg-zinc-900 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ---- RAG Inspector ---------------------------------------------

function InspectorPanel({
  a,
  state,
  title,
  idleHint,
  labels,
  footer,
}: {
  a: Accent;
  state: InspectorState;
  title: string;
  idleHint: string;
  labels: { matchScore: string; apiTrigger: string };
  footer?: React.ReactNode;
}) {
  const status =
    state.phase === "running"
      ? "Live"
      : state.phase === "done"
        ? "Selesai"
        : state.phase === "blocked"
          ? "Diblokir"
          : "Idle";

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Radio
          className={cn(
            "h-4 w-4",
            state.phase === "running" || state.phase === "done"
              ? cn(a.radio, state.phase === "running" && "animate-pulse")
              : state.phase === "blocked"
                ? "text-amber-400"
                : "text-zinc-600",
          )}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </p>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-zinc-600">
          {status}
        </span>
      </div>

      {state.phase === "idle" ? (
        <p className="rounded-lg border border-dashed border-zinc-800 p-3 text-xs leading-relaxed text-zinc-500">
          {idleHint}
        </p>
      ) : null}

      {state.phase === "blocked" ? (
        <div
          className="rounded-lg border border-amber-500/30 bg-amber-500/[0.07] p-3"
          aria-live="polite"
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {state.blockedTitle ?? "Guardrail aktif"}
          </p>
          <ol className="mt-2 space-y-1 font-mono text-[11px] leading-relaxed text-amber-200/80">
            {state.steps.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {(state.phase === "running" || state.phase === "done") && state.data ? (
        <div className="space-y-3">
          <div
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5"
            aria-live="polite"
          >
            <ol className="space-y-1 font-mono text-[11px] leading-relaxed">
              {state.steps.map((step, i) => (
                <li key={step} className="flex gap-1.5 text-zinc-400">
                  <span className={a.stepNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
              {state.phase === "running" ? (
                <li className="flex items-center gap-1.5 text-zinc-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>memproses…</span>
                </li>
              ) : null}
            </ol>
          </div>

          {state.phase === "done" ? (
            <>
              <InspectorField icon={Database} label="Knowledge base source">
                <span className="font-mono text-xs text-zinc-200">
                  {state.data.source}
                </span>
              </InspectorField>

              <div className="grid grid-cols-2 gap-2">
                <InspectorField icon={Timer} label="Latency">
                  <span className="font-mono text-sm text-zinc-100">
                    {state.data.latencyMs} ms
                  </span>
                </InspectorField>
                <InspectorField icon={Target} label={labels.matchScore}>
                  <span className={cn("font-mono text-sm", a.scoreText)}>
                    {state.data.matchScore}
                  </span>
                </InspectorField>
              </div>

              <InspectorField icon={Search} label="Retrieved chunks">
                <ul className="space-y-1">
                  {state.data.chunks.map((c) => (
                    <li
                      key={c.file}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="truncate font-mono text-zinc-400">
                        {c.file}
                      </span>
                      <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">
                        {c.score.toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ul>
              </InspectorField>

              <InspectorField icon={ShieldCheck} label="Guardrail status">
                <div className="flex flex-wrap gap-1.5">
                  {state.guardrails.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {g}
                    </span>
                  ))}
                </div>
              </InspectorField>

              <InspectorField icon={Zap} label={labels.apiTrigger}>
                <code
                  className={cn(
                    "block break-all rounded border border-zinc-800 bg-zinc-950 px-2 py-1.5 font-mono text-[11px]",
                    a.apiText,
                  )}
                >
                  {state.data.apiCall}
                </code>
              </InspectorField>
            </>
          ) : null}
        </div>
      ) : null}

      {footer}
    </div>
  );
}

function InspectorField({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      {children}
    </div>
  );
}
