import React from 'react';
import { z } from 'zod';
import { MessageProps } from './chat/Message';

export const formSchema = z.object({
  message: z.string().min(1, 'Form cannot be empty'),
  image: z.instanceof(File).optional(),
});

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface ChatMessageState {
  messages: Array<MessageProps>
  setMessages?: React.Dispatch<React.SetStateAction<Array<MessageProps>>>
  isChatLoading: boolean;
  setIsChatLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatMessagesContext = React.createContext<ChatMessageState>({
  messages: [],
  isChatLoading: false
});
