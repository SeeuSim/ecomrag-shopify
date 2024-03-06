import { Cross1Icon } from '@radix-ui/react-icons';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  top?: number;
};

const ChatHeader: React.FC<Props> = ({ onClick, top }) => {
  return (
    <div
      id='chat-header'
      className={cn(
        'sticky top-0 inline-flex w-full flex-grow-0 items-center justify-between',
        'bg-primary px-6 py-4 text-primary-foreground',
        top! > 20 && 'bg-primary/70 backdrop-blur-sm transition-all duration-300'
      )}
    >
      <span className='font-medium'>AskShop.AI</span>
      <Button variant='ghost' className='h-10 w-10 p-2 hover:text-primary' onClick={onClick}>
        <Cross1Icon />
      </Button>
    </div>
  );
};

export default ChatHeader;
