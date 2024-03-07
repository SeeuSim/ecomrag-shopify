import React, { type ButtonHTMLAttributes } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MarkdownComponent } from '@/components/ui/markdown';

export type MessageProps = ButtonHTMLAttributes<HTMLDivElement> & {
  content: string;
  role: 'system' | 'user';
};

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(({ content, role }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        'max-w-[80%] p-5 text-xl',
        role == 'system'
          ? 'mr-auto bg-secondary text-secondary-foreground'
          : 'ml-auto bg-primary text-primary-foreground'
      )}
    >
      <CardContent className='p-0'>
        <MarkdownComponent
          className={cn(
            'prose text-xl text-primary-foreground',
            role === 'system' && 'text-secondary-foreground',
            'prose-a:text-blue-500'
          )}
        >
          {content}
        </MarkdownComponent>
      </CardContent>
    </Card>
  );
});
