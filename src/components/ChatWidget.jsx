import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { api } from "../lib/api";

const GREETING =
  "Hey! I'm the Peak Physique AI assistant. Ask me about training, nutrition, pricing, or how to get started.";

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How much does it cost?",
  "How do I get started?",
  "Can you help me lose fat?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) document.getElementById("pp-chat-input")?.focus();
  }, [open]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const { data } = await api.post("/chat", {
        message: trimmed,
        // last 10 turns of real conversation, excluding the initial greeting
        history: next.slice(1, -1).slice(-10),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Feel free to use the booking form above, or try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {open && (
        <div className="mb-4 flex h-[520px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-sm border border-ink-700 bg-ink-900 shadow-2xl animate-fadeUp">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-ink-700 bg-ink-950 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Sparkles size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">Peak AI Assistant</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online now
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={feedRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-gold text-ink-950 font-medium"
                      : "bg-ink-800 text-white/85"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-sm bg-ink-800 px-3.5 py-2.5 text-[13px] text-white/40">···</div>
              </div>
            )}
          </div>

          {/* Quick prompts (only before the conversation starts) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-ink-700 px-4 py-3">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-ink-700 px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink-700 p-3"
          >
            <input
              id="pp-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about fitness..."
              className="field-input flex-1 py-2.5 text-[13px]"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold text-ink-950 transition-opacity hover:bg-gold-light disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink-950 shadow-gold transition-transform hover:scale-105"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}