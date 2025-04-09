
import React, { useState } from 'react';
import { Channel, useChat } from '@/context/ChatContext';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  PlusCircle, 
  Menu, 
  X,
  Wallet
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Sidebar() {
  const { channels, currentChannel, setCurrentChannel, createChannel } = useChat();
  const { account, connectWallet, isConnected, isConnecting } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const isMobile = useIsMobile();

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      createChannel(newChannelName, newChannelDesc);
      setNewChannelName('');
      setNewChannelDesc('');
    }
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(prev => !prev)}
          className="bg-background"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-sidebar z-40 flex flex-col transition-transform duration-300 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-chat-accent" />
            CryptoChat
          </h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Channel Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Channels
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-sidebar-foreground/70 hover:text-sidebar-foreground">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new channel</DialogTitle>
                    <DialogDescription>
                      Enter a name and optional description for your new channel.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="channel-name" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input 
                        id="description" 
                        value={newChannelDesc}
                        onChange={(e) => setNewChannelDesc(e.target.value)}
                        placeholder="What's this channel about?" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateChannel}>Create channel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-1">
              {channels.map((channel) => (
                <ChannelItem 
                  key={channel.id} 
                  channel={channel} 
                  isActive={currentChannel?.id === channel.id}
                  onClick={() => {
                    setCurrentChannel(channel);
                    if (isMobile) setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sidebar-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {account && `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </p>
                <p className="text-xs text-sidebar-foreground/70">Connected</p>
              </div>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
      onClick={onClick}
    >
      <MessageSquare className="w-4 h-4" />
      <span className="truncate">{channel.name}</span>
    </button>
  );
}
