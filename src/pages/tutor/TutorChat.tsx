import { useTutor } from "@/contexts/TutorContext";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const TutorChat = () => {
  const { classes, chatMessages, sendMessage, markMessagesRead } = useTutor();
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const classMessages = chatMessages.filter(m => m.classId === selectedClass);
  const unreadByClass = (classId: string) => chatMessages.filter(m => m.classId === classId && !m.read && m.sender !== "tutor").length;

  useEffect(() => {
    if (selectedClass) markMessagesRead(selectedClass);
  }, [selectedClass, markMessagesRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [classMessages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(selectedClass, input.trim());
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Class list */}
      <div className="w-72 border-r border-border bg-card overflow-y-auto shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Lớp học</h3>
        </div>
        {classes.filter(c => c.escrowStatus !== "refunded").map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClass(c.id)}
            className={cn(
              "w-full text-left p-4 border-b border-border/50 hover:bg-muted/50 transition-colors flex items-center gap-3",
              selectedClass === c.id && "bg-primary/5"
            )}
          >
            <img src={c.studentAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", selectedClass === c.id ? "text-foreground" : "text-muted-foreground")}>{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.studentName}</p>
            </div>
            {unreadByClass(c.id) > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">{unreadByClass(c.id)}</span>
            )}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedClass ? (
          <>
            <div className="p-4 border-b border-border bg-card">
              <p className="text-sm font-semibold text-foreground">{classes.find(c => c.id === selectedClass)?.name}</p>
              <p className="text-xs text-muted-foreground">{classes.find(c => c.id === selectedClass)?.studentName} • {classes.find(c => c.id === selectedClass)?.parentName}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {classMessages.map(m => (
                <div key={m.id} className={cn("flex", m.sender === "tutor" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm",
                    m.sender === "tutor"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}>
                    {m.sender !== "tutor" && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{m.senderName}</p>}
                    <p>{m.message}</p>
                    <p className={cn("text-[10px] mt-1", m.sender === "tutor" ? "text-primary-foreground/60" : "text-muted-foreground")}>{m.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-card flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm"
                placeholder="Nhập tin nhắn..."
              />
              <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Chọn lớp để bắt đầu chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorChat;
