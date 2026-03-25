import { useStudent } from "@/contexts/StudentContext";
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useMemo } from "react";

const StudentChat = () => {
  const { classes, chatMessages, sendChatMessage, markChatRead } = useStudent();
  const activeClasses = useMemo(
    () => classes.filter((c) => c.status === "active"),
    [classes]
  );

  const [selectedClass, setSelectedClass] = useState<string>(activeClasses[0]?.id || "");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedClass && activeClasses.length > 0) {
      setSelectedClass(activeClasses[0].id);
    }
  }, [activeClasses, selectedClass]);

  const visibleClasses = useMemo(() => {
    return activeClasses.filter((c) => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;
      return (
        c.name.toLowerCase().includes(keyword) ||
        c.tutorName.toLowerCase().includes(keyword)
      );
    });
  }, [activeClasses, search]);

  const selectedClassInfo = activeClasses.find((c) => c.id === selectedClass);

  const classMessages = chatMessages.filter((m) => m.classId === selectedClass);

  const unreadByClass = (classId: string) =>
    chatMessages.filter(
      (m) => m.classId === classId && !m.read && m.sender !== "student"
    ).length;

  useEffect(() => {
    if (selectedClass) markChatRead(selectedClass);
  }, [selectedClass, markChatRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [classMessages.length]);

  const handleSend = () => {
    if (!input.trim() || !selectedClass) return;
    sendChatMessage(selectedClass, input.trim());
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] rounded-3xl border border-border bg-background overflow-hidden shadow-sm">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/70 backdrop-blur shrink-0 flex flex-col">
          <div className="p-5 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Tin nhắn lớp học</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Trao đổi trực tiếp với gia sư
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm lớp hoặc gia sư..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {visibleClasses.length > 0 ? (
              <div className="p-2">
                {visibleClasses.map((c) => {
                  const unread = unreadByClass(c.id);
                  const active = selectedClass === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClass(c.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl transition-all mb-2 group border",
                        active
                          ? "bg-primary/8 border-primary/20 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-muted/60 hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={c.tutorAvatar}
                            alt={c.tutorName}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-background"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm font-semibold truncate",
                                active ? "text-foreground" : "text-foreground/90"
                              )}
                            >
                              {c.name}
                            </p>

                            {unread > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                                {unread}
                              </span>
                            )}
                          </div>

                          <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                            Gia sư: {c.tutorName}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center">
                    <Search className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Không tìm thấy lớp phù hợp</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Thử tìm bằng tên lớp hoặc tên gia sư
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat section */}
        <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-b from-background to-muted/20">
          {selectedClass && selectedClassInfo ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border bg-card/80 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={selectedClassInfo.tutorAvatar}
                        alt={selectedClassInfo.tutorName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-background"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {selectedClassInfo.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedClassInfo.tutorName}
                      </p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        Đang hoạt động
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="w-9 h-9 rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-9 h-9 rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-9 h-9 rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-4">
                {classMessages.length > 0 ? (
                  classMessages.map((m) => {
                    const isStudent = m.sender === "student";

                    return (
                      <div
                        key={m.id}
                        className={cn("flex", isStudent ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[78%] sm:max-w-[70%] rounded-3xl px-4 py-3 shadow-sm border",
                            isStudent
                              ? "bg-primary text-primary-foreground rounded-br-md border-primary/20"
                              : "bg-card text-foreground rounded-bl-md border-border"
                          )}
                        >
                          {!isStudent && (
                            <p className="text-[11px] font-semibold mb-1 text-primary">
                              {m.senderName}
                            </p>
                          )}

                          <p className="text-sm leading-relaxed break-words">{m.message}</p>

                          <div
                            className={cn(
                              "mt-2 flex items-center gap-1 text-[10px]",
                              isStudent
                                ? "justify-end text-primary-foreground/70"
                                : "justify-end text-muted-foreground"
                            )}
                          >
                            <span>{m.timestamp}</span>
                            {isStudent && <CheckCheck className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full min-h-[320px] flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Chưa có tin nhắn nào
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Hãy bắt đầu cuộc trò chuyện với gia sư để trao đổi về lịch học, bài tập và tiến độ học tập.
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card/85 backdrop-blur">
                <div className="flex items-end gap-3">
                  <div className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      placeholder="Nhập tin nhắn..."
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="h-11 px-4 rounded-2xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Gửi</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-[28px] bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-9 h-9 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">Chọn lớp để bắt đầu chat</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hãy chọn một lớp học ở bên trái để xem và gửi tin nhắn
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChat;