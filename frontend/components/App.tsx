import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Toggle } from '@/components/buttons/Toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import ChatHeader from './sections/ChatHeader';
import ChatInput from './sections/ChatInput';
import ChatMessages from './sections/ChatMessages';

const App: React.FC<{}> = () => {
  const [open, setIsOpen] = useState(false);

  return (
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
            'max-h-[90dvh] min-h-[550px] min-w-[450px] max-w-[90dvw]',
            'flex flex-col'
          )}
        >
          <div id='chat-container' className='flex flex-col overflow-y-scroll'>
            <ChatHeader onClick={() => setIsOpen((_open) => !_open)} />
            <ChatMessages />
          </div>
          <ChatInput />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default App;
