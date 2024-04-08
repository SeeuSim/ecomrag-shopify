import React, { type ButtonHTMLAttributes } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MarkdownComponent } from '@/components/ui/markdown';

export type MessageProps = ButtonHTMLAttributes<HTMLDivElement> & {
  content: string;
  role: 'system' | 'user';
  img?: string;
};

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ content, role, img }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'max-w-[80%] p-5 text-xl',
          role == 'system'
            ? 'mr-auto border-border bg-secondary text-secondary-foreground'
            : 'ml-auto border-primary bg-primary text-primary-foreground'
        )}
      >
        <CardContent className='p-0'>
          {img && (
            <div className='mb-2 flex max-w-[200px] flex-shrink-0 flex-grow-0 overflow-clip rounded-md'>
              <img src={img} className='object-cover' loading='lazy' />
            </div>
          )}
          <MarkdownComponent
            className={cn(
              'prose text-xl text-primary-foreground',
              role === 'system' && 'text-secondary-foreground',
              'prose-a:text-primary/70 prose-a:hover:text-primary'
            )}
          >
            {content}
          </MarkdownComponent>
        </CardContent>
      </Card>
    );
  }
);
