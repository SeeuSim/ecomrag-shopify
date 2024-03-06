import { Cross1Icon } from '@radix-ui/react-icons';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const ChatHeader: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      id='chat-header'
      className={cn(
        'sticky top-0 inline-flex w-full flex-grow-0 items-center justify-between',
        'z-20 bg-primary/70 px-6 py-4 text-primary-foreground backdrop-blur'
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
