import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon } from '@radix-ui/react-icons';
import { Loader2, Send, X } from 'lucide-react';
import { useContext, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

import { ChatMessagesContext, formSchema, formatFileSize } from './utils';

const ChatInput = () => {
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const {
    messages,
    setMessages,
    isChatLoading: isSubmitting,
    setIsChatLoading: setIsSubmitting,
  } = useContext(ChatMessagesContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const image = form.watch('image');
  const message = form.watch('message');

  const isDisabled = useMemo(() => {
    return isSubmitting || message.length === 0;
  }, [message, isSubmitting]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting!(true);
    form.reset();
    setMessages!((initial) => [
      ...initial,
      {
        role: 'user',
        content: values.message,
        img: previewImageSrc,
      },
    ]);
    setPreviewImageSrc('');

    let payload: {
      Message: string;
      ShopId?: string;
      Image?: { FileName: string; FileType: string; FileContent: unknown };
      ChatHistory: typeof messages;
    } = {
      Message: values.message,
      ShopId: window.askShopAI_data?.shopId,
      ChatHistory: messages.slice(1), // Latest change not propagated
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
        'Access-Control-Allow-Origin': window.location.origin, // TODO: change this to the FE url
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setIsSubmitting!(false);
      // TODO: handle
      return;
    }

    const decodedStreamReader = response.body!.pipeThrough(new TextDecoderStream()).getReader();

    decodedStreamReader.closed.catch((_error) => {
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
    setIsSubmitting!(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-auto flex w-full flex-col gap-4 border-t border-border p-6 pt-4'
      >
        {previewImageSrc.length > 0 && (
          <div className='flex w-full'>
            <div
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'inline-flex h-[4.5rem] gap-4 p-2 hover:bg-inherit'
              )}
            >
              <div className='flex h-[30px] w-[30px] flex-shrink-0 flex-grow-0 overflow-clip rounded-md'>
                <img src={previewImageSrc} className='object-cover' loading='lazy' />
              </div>
              <span className='truncate text-2xl font-light'>{image?.name}</span>
              <span className='ml-2 text-xl font-normal'>
                {image?.size && formatFileSize(image.size)}
              </span>
              <div
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'flex-shrink-0 flex-grow-0 border p-1 hover:scale-105 hover:bg-secondary'
                )}
                onClick={() => {
                  form.setValue('image', undefined);
                  setPreviewImageSrc('');
                }}
              >
                <X className='h-7 w-7' />
              </div>
            </div>
          </div>
        )}
        <div className='inline-flex w-full items-center justify-between gap-4'>
          <FormField
            control={form.control}
            name='image'
            render={({ field: _field }) => (
              <FormItem>
                <FormControl>
                  <FormLabel
                    htmlFor='file-upload'
                    className='inline-flex h-[36px] w-[36px] flex-shrink-0 flex-grow-0 place-content-center items-center justify-center whitespace-nowrap rounded-lg bg-secondary p-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:cursor-pointer hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  >
                    <UploadIcon className='h-6 w-6 ' />
                    <Input
                      ref={fileInputRef}
                      id='file-upload'
                      type='file'
                      accept='image/*'
                      disabled={isSubmitting}
                      onChange={(event) => {
                        if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                          form.setValue('image', event.currentTarget.files[0]);
                          const reader = new FileReader();
                          reader.onload = () => {
                            setPreviewImageSrc(reader.result as string);
                          };
                          reader.readAsDataURL(event.currentTarget.files[0]);
                          event.currentTarget.value = '';
                        }
                      }}
                      className='hidden'
                    />
                  </FormLabel>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='message'
            render={({ field, fieldState }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    type='text'
                    placeholder="Enter your preferences to find matching products."
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
            disabled={isDisabled}
          >
            {isSubmitting ? (
              <Loader2 className='h-6 w-6 animate-spin' />
            ) : (
              <Send className='h-6 w-6 ' />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
