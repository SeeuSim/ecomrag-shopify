import React from 'react';
import { z } from 'zod';
import { MessageProps } from './chat/Message';

export const formSchema = z.object({
  message: z.string().min(1, 'Form cannot be empty'),
  image: z.instanceof(File).optional(),
});

interface ChatMessageState {
  messages: Array<MessageProps>
  setMessages?: React.Dispatch<React.SetStateAction<Array<MessageProps>>> 
}

export const ChatMessagesContext = React.createContext<ChatMessageState>({
    messages: []
});
