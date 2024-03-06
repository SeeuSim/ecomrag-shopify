import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { ButtonHTMLAttributes } from 'react';

export type MessageProps = ButtonHTMLAttributes<HTMLDivElement> &  {
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
      <span>{content}</span>
    </Card>
  );
});
