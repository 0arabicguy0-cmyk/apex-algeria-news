import { useEffect, useState } from "react";
import { feedbackApi, subscribe, type MockFeedback } from "@/lib/mockStore";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen } from "lucide-react";

export default function AdminFeedback() {
  const [selected, setSelected] = useState<MockFeedback | null>(null);
  const [, force] = useState(0);

  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  const messages = feedbackApi.all();

  const open = (msg: MockFeedback) => {
    if (!msg.is_read) feedbackApi.markRead(msg.id);
    setSelected(msg);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">صندوق الرسائل</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => open(m)}
              className={`w-full text-right p-3 rounded-lg border transition-colors ${
                selected?.id === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {m.is_read ? <MailOpen className="w-3.5 h-3.5 text-muted-foreground" /> : <Mail className="w-3.5 h-3.5 text-primary" />}
                <span className={`text-sm font-medium ${m.is_read ? "text-muted-foreground" : "text-foreground"}`}>{m.name}</span>
                {!m.is_read && <Badge className="text-[10px] h-4 px-1.5">جديد</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{m.message}</p>
            </button>
          ))}
          {messages.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد رسائل</p>}
        </div>

        <div className="md:col-span-2 border border-border rounded-xl p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">{selected.name}</h2>
                <span className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleDateString("ar-DZ")}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2" dir="ltr">{selected.email}</p>
              <hr className="my-4 border-border" />
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-16">اختر رسالة لعرضها</p>
          )}
        </div>
      </div>
    </div>
  );
}
