import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon } from '@radix-ui/react-icons';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChatMessagesContext, formSchema } from './utils';
import { cn } from '@/lib/utils';
import { useContext, useState } from 'react';

const ChatInput = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setMessages } = useContext(ChatMessagesContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    form.reset();
    if (setMessages) {
      setMessages((initial) => [
        ...initial,
        {
          role: 'user',
          content: values.message,
        },
      ]);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-auto inline-flex w-full items-center justify-between gap-4 border-t border-border p-6'
      >
        <Button
          variant='secondary'
          className='flex h-[36px] w-[36px] flex-shrink-0 flex-grow-0 rounded-lg p-2'
          disabled={isSubmitting}
        >
          <UploadIcon className='h-6 w-6 ' />
        </Button>
        <FormField
          control={form.control}
          name='message'
          render={({ field, fieldState }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Type your message...'
                  disabled={isSubmitting}
                  className={cn(
                    'flex h-[36px] w-full rounded-lg text-2xl',
                    fieldState.error && 'ring-1 ring-destructive'
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className='flex h-[36px] w-[36px] flex-shrink-0 flex-grow-0 rounded-lg p-2'
          type='submit'
          disabled={isSubmitting}
        >
          <Send className='h-6 w-6 ' />
        </Button>
      </form>
    </Form>
  );
};

export default ChatInput;
