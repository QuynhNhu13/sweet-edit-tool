import { useParent } from "@/contexts/ParentContext";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ParentChat = () => {
  const { chatMessages, sendChatMessage, markChatRead } = useParent();
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Unique contacts
  const contacts = Array.from(new Map(chatMessages.map(m => [m.contactId, { id: m.contactId, name: m.contactName, avatar: m.contactAvatar }])).values());
  const activeContact = selectedContact || contacts[0]?.id || "";
  const msgs = chatMessages.filter(m => m.contactId === activeContact);
  const unreadByContact = (cId: string) => chatMessages.filter(m => m.contactId === cId && !m.read && m.sender !== "parent").length;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, activeContact]);
  useEffect(() => { if (activeContact) markChatRead(activeContact); }, [activeContact, markChatRead]);

  const handleSend = () => {
    if (!msg.trim() || !activeContact) return;
    sendChatMessage(activeContact, msg.trim());
    setMsg("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Contact list */}
      <div className="w-[280px] border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Tin nhắn</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(c => (
            <button key={c.id} onClick={() => setSelectedContact(c.id)}
              className={cn("w-full flex items-center gap-3 p-3 border-b border-border/50 hover:bg-muted/50 transition-colors text-left", activeContact === c.id && "bg-primary/5")}>
              <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{chatMessages.filter(m => m.contactId === c.id).slice(-1)[0]?.message}</p>
              </div>
              {unreadByContact(c.id) > 0 && <span className="min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">{unreadByContact(c.id)}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            <div className="h-14 px-4 border-b border-border flex items-center gap-3">
              <img src={contacts.find(c => c.id === activeContact)?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <p className="text-sm font-semibold text-foreground">{contacts.find(c => c.id === activeContact)?.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map(m => (
                <div key={m.id} className={cn("flex", m.sender === "parent" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[70%] px-4 py-2.5 rounded-2xl text-sm", m.sender === "parent" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                    {m.message}
                    <p className={cn("text-[10px] mt-1", m.sender === "parent" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Nhập tin nhắn..." className="rounded-xl"
                onKeyDown={e => e.key === "Enter" && handleSend()} />
              <Button onClick={handleSend} size="icon" className="rounded-xl shrink-0"><Send className="w-4 h-4" /></Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center"><p className="text-sm text-muted-foreground">Chọn cuộc trò chuyện</p></div>
        )}
      </div>
    </div>
  );
};

export default ParentChat;
