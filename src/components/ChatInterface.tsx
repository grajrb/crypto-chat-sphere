
import React, { useState, useRef, useEffect } from 'react';
import { useChat, Message as MessageType } from '@/context/ChatContext';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SendHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatInterface() {
  const { messages, sendMessage, currentChannel, loading } = useChat();
  const { isConnected, connectWallet } = useWeb3();
  const [messageInput, setMessageInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput.trim());
      setMessageInput('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Channel header */}
      <div className="py-3 px-4 border-b">
        <h2 className="font-semibold">#{currentChannel.name}</h2>
        {currentChannel.description && (
          <p className="text-sm text-muted-foreground">{currentChannel.description}</p>
        )}
      </div>
      
      {/* Messages area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Be the first to send a message!</p>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="p-4 border-t">
        {isConnected ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" disabled={!messageInput.trim()}>
              <SendHorizontal className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Connect your wallet to send messages</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Message({ message }: { message: MessageType }) {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 animate-fade-in",
        message.isMine && "justify-end"
      )}
    >
      {!message.isMine && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-medium text-primary">
            {message.sender.substring(2, 4)}
          </span>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg p-3",
        message.isMine 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary"
      )}>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            message.isMine ? "text-primary-foreground/90" : "text-foreground"
          )}>
            {message.isMine ? "You" : message.sender}
          </span>
          <span className={cn(
            "text-xs",
            message.isMine ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {format(message.timestamp, 'p')}
          </span>
        </div>
        <p className="mt-1 break-words">{message.content}</p>
      </div>
      
      {message.isMine && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-medium text-primary-foreground">
            YOU
          </span>
        </div>
      )}
    </div>
  );
}
