import { Button } from "@/components/ui/button"; // Import Button component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import { useChat } from "ai/react"; // Import custom hook for chat functionality
import { useCallback, useEffect, useRef } from "react"; // Import useCallback, useEffect, and useRef hooks
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Import syntax highlighter component
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"; // Import syntax highlighter theme

// Utility function to detect if the content contains code blocks or inline code
const containsCodeBlock = (content: string): boolean => {
  return content.includes("```") || content.includes("`");
};

// Utility function to format code blocks with syntax highlighting
const formatCodeBlock = (content: string) => {
  // Regex to match code blocks in the content
  const codeBlockRegex = /```([\s\S]*?)```/g;
  // Regex to match inline code
  const inlineCodeRegex = /`([^`]+)`/g;

  // First, format code blocks
  const parts: (string | JSX.Element)[] = content.split(codeBlockRegex).map((part: string, index: number) => {
    // For code blocks, apply syntax highlighting
    if (index % 2 === 1) {
      return (
        <SyntaxHighlighter key={index} language="javascript" style={tomorrow}>
          {part.trim()}
        </SyntaxHighlighter>
      );
    }
    return part;
  });

  // Apply inline code highlighting
  return parts.map((part: string | JSX.Element, index: number) => {
    if (typeof part === "string") {
      const inlineParts = part.split(inlineCodeRegex);
      return (
        <p key={index}>
          {inlineParts.map((inlinePart: string, inlineIndex: number) =>
            inlineIndex % 2 === 1 ? (
              <code key={inlineIndex} className="inline-code">
                {inlinePart}
              </code>
            ) : (
              inlinePart
            )
          )}
        </p>
      );
    }
    return part;
  });
};

// Component for the send icon
function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" /> {/* Path for the send icon */}
      <path d="M22 2 11 13" /> {/* Path for the send icon */}
    </svg>
  );
}

// Component for the close (X) icon
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" /> {/* Path for the X icon */}
      <path d="m6 6 12 12" /> {/* Path for the X icon */}
    </svg>
  );
}

// Main component for the chat interface
export function Component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat(); // Destructure chat functions and state from custom hook
  const chatEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to the end of the chat

  // Handle Enter key press to submit the message
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent default behavior (new line)
        handleSubmit(event); // Call the submit function
      }
    },
    [handleSubmit]
  );

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {" "}
      {/* Container for the chat application */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        {" "}
        {/* Header with styling */}
        <h1 className="text-2xl font-bold">
          AI Chat & {" "}
          <span
            style={{
              background: "linear-gradient(90deg, #7F7FD5, #A0C0FF)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            &lt;code-helper/&gt;
          </span>
        </h1>
        {/* Title */}
      </header>
      <div className="flex-1 overflow-auto p-6">
        {" "}
        {/* Main chat area */}
        <div className="space-y-4">
          {" "}
          {/* Container for messages */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-4 ${
                m.role === "user" ? "justify-end" : ""
              }`}
            >
              {/* Display user or AI messages differently */}
              {m.role === "user" ? (
                <>
                  <div className="bg-slate-200 p-4 rounded-lg max-w-[80%]">
                    <p>{m.content}</p> {/* User message content */}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder-user.jpg" />{" "}
                    {/* User avatar image */}
                    <AvatarFallback>U</AvatarFallback> {/* Fallback text */}
                  </Avatar>
                </>
              ) : (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder-user.jpg" />{" "}
                    {/* AI avatar image */}
                    <AvatarFallback>AI</AvatarFallback> {/* Fallback text */}
                  </Avatar>
                  <div className="bg-primary text-primary-foreground p-4 rounded-lg max-w-[80%]">
                    {/* Display formatted code or plain text */}
                    {containsCodeBlock(m.content) ? (
                      formatCodeBlock(m.content)
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />{" "}
          {/* This div is used to scroll to the bottom */}
        </div>
      </div>
      <div className="bg-background border-t px-6 py-4">
        {" "}
        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full rounded-lg pr-16 resize-none text-lg"
            rows={1}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="bg-primary text-white absolute top-1/2 right-4 -translate-y-1/2"
          >
            <SendIcon className="w-5 h-5" /> {/* Send button with icon */}
            <span className="sr-only">Send</span>{" "}
            {/* Screen reader only text */}
          </Button>
        </form>
      </div>
    </div>
  );
}
