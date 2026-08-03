import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDateTime } from "../../lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const [coach, setCoach] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const bottomRef = useRef(null);

  const loadThread = async (coachId) => {
    const { data } = await api.get(`/messages/thread/${coachId}`);
    setMessages(data);
  };

  useEffect(() => {
    let timer;
    api
      .get("/users/coach")
      .then(async ({ data }) => {
        setCoach(data);
        await loadThread(data.id);
        timer = setInterval(() => loadThread(data.id).catch(() => {}), 8000);
      })
      .catch(() => setErr("No coach is available to message yet."))
      .finally(() => setLoading(false));
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !coach) return;
    const body = text.trim();
    setText("");
    const { data } = await api.post("/messages", { recipient_id: coach.id, body });
    setMessages((m) => [...m, data]);
  };

  if (loading) return <div className="card text-sm text-white/40">Loading…</div>;

  if (err) {
    return (
      <div className="card flex flex-col items-center py-14 text-center">
        <MessageSquare size={40} className="text-gold" />
        <p className="mt-4 text-white/60">{err}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-[1px]">Message Your Coach</h2>
        <p className="text-sm text-white/40">
          Chatting with {coach?.first_name} {coach?.last_name}
        </p>
      </div>

      <div className="card flex h-[60vh] flex-col !p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-white/40">
              Say hello 👋 — ask a question about your plan, nutrition, or schedule.
            </p>
          )}
          {messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-sm px-4 py-2.5 text-sm ${
                    mine ? "bg-gold text-ink-950" : "bg-ink-800 text-white/85"
                  }`}
                >
                  <p>{m.body}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-ink-950/60" : "text-white/40"}`}>
                    {formatDateTime(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex gap-3 border-t border-ink-800 p-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="field-input flex-1"
          />
          <button type="submit" className="btn-primary !px-5">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
