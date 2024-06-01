import React, { useEffect, useMemo, useState } from 'react';

import api from '../lib/api';
import { Provider } from '@gadgetinc/react';

import { Toggle } from '@/components/buttons/Toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, getShopSettings } from '@/lib/utils';

import ChatHeader from './sections/ChatHeader';
import ChatInput from './sections/ChatInput';
import ChatMessages from './sections/ChatMessages';
import { ChatMessagesContext } from './sections/utils';
import { MessageProps } from './sections/chat/Message';

const initialMessage: MessageProps = {
  role: 'system',
  content: `Hello! Feel free to ask any questions based on your needs! I'll recommend you the best products!`,
};

const App: React.FC<{}> = () => {
  const [open, setIsOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [shopSettings, setShopSettings] = useState<Awaited<ReturnType<typeof getShopSettings>>>({});

  const [messages, setMessages] = useState([initialMessage]);

  // 1. Fetch from shop API and display accordingly
  useEffect(() => {
    getShopSettings(api).then(setShopSettings);
  }, []);

  // 2. Set initial message as described by shop settings API
  useEffect(() => {
    setMessages([
      { ...initialMessage, content: shopSettings?.introductionMessage ?? initialMessage.content },
      ...messages.slice(1),
    ]);
  }, [shopSettings]);

  // 3. Provide hook to reset messages
  const resetMessages = useMemo(() => {
    return () => {
      setMessages([
        { ...initialMessage, content: shopSettings?.introductionMessage ?? initialMessage.content },
      ]);
      setIsChatLoading(false);
    };
  }, [shopSettings]);

  return (
    <Provider api={api}>
      <div className='fixed bottom-5 right-5 z-[1000]'>
        <Popover open={open} onOpenChange={setIsOpen}>
          <PopoverTrigger
            // asChild
            className='focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:ring-offset-transparent'
          >
            <Toggle />
          </PopoverTrigger>
          <PopoverContent
            side='top'
            id='chat-window'
            className={cn(
              'z-[1100] translate-y-[44px] wide:translate-x-[-24px]',
              'overflow-clip rounded-lg border-0 bg-background p-0 text-card-foreground shadow',
              'max-h-[calc(100dvh-60px)] min-h-[min(100dvh-50px,550px)] w-screen tall:max-h-[calc(100dvh-160px)] wide:w-[450px]',
              'flex flex-col'
            )}
          >
            <ChatMessagesContext.Provider
              value={{ messages, setMessages, isChatLoading, setIsChatLoading }}
            >
              <div
                id='chat-container'
                className={cn('flex h-full flex-col overflow-y-auto overflow-x-hidden')}
              >
                <ChatHeader
                  name={shopSettings?.name ?? 'AskShop.AI'}
                  onClick={() => setIsOpen((_open) => !_open)}
                  resetMessages={resetMessages}
                />
                <ChatMessages />
              </div>
              <ChatInput />
            </ChatMessagesContext.Provider>
          </PopoverContent>
        </Popover>
      </div>
    </Provider>
  );
};

export default App;
