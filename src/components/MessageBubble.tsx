import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MessageBubbleProps {
  to: string;
  unreadCount?: number;
}

const MessageBubble = ({ to, unreadCount = 0 }: MessageBubbleProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={() => navigate(to)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default MessageBubble;
