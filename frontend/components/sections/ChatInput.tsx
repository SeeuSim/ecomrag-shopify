import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon } from '@radix-ui/react-icons';
import { Loader2, Send } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChatMessagesContext, formSchema } from './utils';

const ChatInput = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setMessages } = useContext(ChatMessagesContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

    let payload: {
      Message: string;
      ShopId: string;
      Image?: { FileName: string; FileType: string; FileContent: unknown };
    } = {
      Message: values.message,
      ShopId: sessionStorage.getItem('shop-id')!,
    };

    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    if (values.image) {
      let imagePart = {
        FileName: values.image.name,
        FileType: values.image.type,
        FileContent: await toBase64(values.image),
      };
      payload = { ...payload, Image: imagePart };
    }

    const response: Response = await api.fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setIsSubmitting(false);
      // TODO: handle
      return;
    }

    const decodedStreamReader = response.body!.pipeThrough(new TextDecoderStream()).getReader();

    decodedStreamReader.closed.catch((error) => {
      // TODO: handle
    });

    let { value, done } = await decodedStreamReader.read();
    setMessages!((messages) => [...messages, { role: 'system', content: value! }]);
    while (!done) {
      const { value: newValue, done: newIsDone } = await decodedStreamReader.read();
      value = newValue;
      done = newIsDone;
      if (newValue) {
        setMessages!((messages) =>
          messages.map((message, index) => {
            if (index < messages.length - 1) {
              return message;
            }
            return { ...message, content: message.content + newValue };
          })
        );
      }
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
          {isSubmitting ? (
            <Loader2 className='h-6 w-6 animate-spin' />
          ) : (
            <Send className='h-6 w-6 ' />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChatInput;
