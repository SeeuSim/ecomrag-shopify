import { UploadIcon } from '@radix-ui/react-icons';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatInput = () => {
  return (
    <form className='mt-auto inline-flex w-full items-center justify-between gap-4 border-t border-border p-6'>
      <Button
        variant='secondary'
        className='flex h-[36px] w-[36px] flex-shrink-0 flex-grow-0 rounded-lg p-2'
      >
        <UploadIcon className='h-6 w-6 ' />
      </Button>
      <Input type='text' className='flex h-[36px] rounded-lg text-2xl' />
      <Button className='flex h-[36px] w-[36px] flex-shrink-0 flex-grow-0 rounded-lg p-2'>
        <Send className='h-6 w-6 ' />
      </Button>
    </form>
  );
};

export default ChatInput;
