import { Cross1Icon } from '@radix-ui/react-icons';
import React, { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatMessagesContext } from './utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string;
  resetMessages?: React.MouseEventHandler<HTMLButtonElement>;
};

const ChatHeader: React.FC<Props> = ({ onClick, resetMessages, name: shopName }) => {
  const { messages } = useContext(ChatMessagesContext);

  return (
    <div
      id='chat-header'
      className={cn(
        'fixed top-0 inline-flex w-full flex-grow-0 items-center justify-between',
        'z-20 bg-primary/70 px-6 py-4 text-primary-foreground backdrop-blur-sm'
      )}
    >
      <span className='font-medium'>{shopName}</span>
      <div className='inline-flex gap-2'>
        {messages.length > 1 && (
          <Button variant='ghost' className='text-xl' onClick={resetMessages}>
            Clear Chat
          </Button>
        )}
        <Button variant='ghost' className='h-10 w-10 p-2 hover:text-primary' onClick={onClick}>
          <Cross1Icon />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
