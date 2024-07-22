"use client";
import { useChat } from "ai/react";

export default function chatComponent() {
  const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat();

  return (
    <div>

      <div>
        <h2 className="text-lg font-semibold mt-2">GPT-4</h2>
        <p className="text-sm mt-2">Welcome to the GPT-4 chatbot. Please enter your message below.</p>
      </div>
      <form className="mt-12" onSubmit={handleSubmit}>
        <p>User Message:</p>
        <textarea name="" id="" className="mt-2 w-full bg-slate-600 p-2" placeholder="Enter your message here..."         value={input}
        onChange={handleInputChange}></textarea>
        <button className="mt-2 bg-slate-700 p-2 text-white">Send</button>
      </form>
    </div>
  )
}