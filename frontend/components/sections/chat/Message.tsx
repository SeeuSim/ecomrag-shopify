import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

export type MessageProps = {
  content: string;
  role: 'system' | 'user';
};

export const Message: React.FC<MessageProps> = ({ content, role }) => {
  return (
    <Card
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
};
