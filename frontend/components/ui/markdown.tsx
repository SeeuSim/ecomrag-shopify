import { CopyIcon } from 'lucide-react';
import React from 'react';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const MarkdownComponent = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className }, _ref) => {
    return (
      <Markdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        className={cn('', className)}
        components={{
          code({ children, className, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className='flex flex-col'>
                <div className='inline-flex translate-y-[10px] items-center justify-between rounded-t-sm p-1 text-sm'>
                  <span className='px-2'>{match[1]}</span>
                  <Button
                    variant='ghost'
                    className='flex h-6 flex-row gap-2 font-sans'
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                      // toast({ title: 'Code copied!' });
                    }}
                  >
                    <span>Copy</span>
                    <CopyIcon />
                  </Button>
                </div>
                <SyntaxHighlighter
                  {...rest}
                  ref={null}
                  PreTag='div'
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  className='rounded-t-none'
                  style={oneDark}
                />
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
          img({ src }) {
            return (
              <img
                src={src}
                onLoad={() => {
                  var chatWindow = document.getElementById('chat-container')!;
                  chatWindow.scrollTop = chatWindow.scrollHeight;
                }}
                className='max-w-full rounded-xl border border-border shadow-sm'
              />
            );
          },
        }}
      >
        {children as string}
      </Markdown>
    );
  }
);
