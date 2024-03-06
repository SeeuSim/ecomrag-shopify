import { useContext, useEffect, useRef } from 'react';

import { Message } from '@/components/sections/chat/Message';
import { ChatMessagesContext } from './utils';

const ChatMessages = () => {
  const { messages } = useContext(ChatMessagesContext);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, lastMessageRef]);

  return (
    <div
      id='chat-messages'
      className='z-10 flex w-full flex-col gap-5 border-t-[45px] border-primary p-5'
    >
      {messages.map((element, index) => (
        <Message
          key={index}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          {...element}
        />
      ))}
      <div id='last-message' className='' />
    </div>
  );
};

export default ChatMessages;
