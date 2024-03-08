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
  content: `Hello! Feel free to ask any questions based on your needs! Such as a Y2K fit or looking like a specific celebrity. I'm here to help you find the perfect outfit!`,
};

const App: React.FC<{}> = () => {
  const [open, setIsOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [shopSettings, setShopSettings] = useState<Awaited<ReturnType<typeof getShopSettings>>>({});

  const [messages, setMessages] = useState([initialMessage]);

  useEffect(() => {
    getShopSettings(api).then(setShopSettings);
  }, []);

  const resetMessages = useMemo(() => {
    return () =>
      setMessages([
        { ...initialMessage, content: shopSettings.introductionMessage ?? initialMessage.content },
      ]);
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
              'z-[1100] translate-x-[-24px] translate-y-[44px]',
              'overflow-clip rounded-lg border-0 bg-background p-0 text-card-foreground shadow',
              'h-[90dvh] max-w-[90dvw] tall:h-[550px] wide:w-[450px]',
              'flex flex-col'
            )}
          >
            <ChatMessagesContext.Provider
              value={{ messages, setMessages, isChatLoading, setIsChatLoading }}
            >
              <div
                id='chat-container'
                className={cn(
                  'flex h-full flex-col overflow-y-auto overflow-x-hidden'
                )}
              >
                <ChatHeader
                  name={shopSettings.name ?? 'AskShop.AI'}
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
