
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { ChatProvider } from '@/context/ChatContext';
import { Web3Provider } from '@/context/Web3Context';

const Index = () => {
  return (
    <Web3Provider>
      <ChatProvider>
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64">
            <div className="h-screen flex flex-col">
              <ChatInterface />
            </div>
          </main>
        </div>
      </ChatProvider>
    </Web3Provider>
  );
};

export default Index;
