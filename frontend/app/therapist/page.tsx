"use client";

import { useEffect, useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/components/ToastProvider";

export default function TherapistPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🔄 Scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 📥 Fetch history
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapist/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMessages(data);
          setTimeout(scrollToBottom, 100);
        }
      });
  }, []);

  // 📤 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");

    const userMessage = {
      role: "user",
      message: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapist/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessages(prev => [
        ...prev,
        { role: "assistant", message: data.reply },
      ]);

      setTimeout(scrollToBottom, 100);

    } catch (err) {
      addToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto flex flex-col h-[85vh] bg-white rounded-2xl shadow-md">
        
        {/* Header */}
        <div className="p-4 border-b text-center font-semibold text-pink-500">
          💬 Therapist
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] p-3 rounded-xl ${
                msg.role === "user"
                  ? "ml-auto bg-pink-400 text-white"
                  : "mr-auto bg-gray-100 text-black"
              }`}
            >
              {msg.message}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-100 px-3 py-2 rounded-xl text-sm text-gray-500">
              Typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk about anything..."
            className="flex-1 border rounded-lg px-3 py-2 text-black"
          />

          <button
            onClick={sendMessage}
            className="bg-pink-400 hover:bg-pink-500 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </AppLayout>
  );
}