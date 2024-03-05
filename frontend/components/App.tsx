import React, { useState } from 'react';
import { Toggle } from '@/components/buttons/Toggle';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Cross1Icon, UploadIcon } from '@radix-ui/react-icons';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

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
          className={cn(
            'z-[1100] translate-x-[-24px] translate-y-[44px]',
            'overflow-clip rounded-lg border-0 bg-card p-0 text-card-foreground shadow',
            'max-h-[90dvh] min-h-[550px] min-w-[450px] max-w-[90dvw]',
            'flex flex-col'
          )}
        >
          <div className='inline-flex w-full items-center justify-between bg-primary px-6 py-4 text-primary-foreground'>
            <span>Header</span>
            <Button
              variant='ghost'
              className='h-10 w-10 p-2 hover:text-primary'
              onClick={() => setIsOpen((_open) => !_open)}
            >
              <Cross1Icon />
            </Button>
          </div>
          <ScrollArea className='h-[calc(100%-44px)]' />
          <div className='mt-auto inline-flex w-full items-center justify-between gap-4 border-t border-border p-6'>
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default App;
