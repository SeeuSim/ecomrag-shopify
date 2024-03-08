import { useContext, useEffect, useRef } from 'react';

import { Message } from '@/components/sections/chat/Message';
import { ChatMessagesContext } from './utils';

const ChatMessages = () => {
  const { messages, isChatLoading } = useContext(ChatMessagesContext);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // lastMessageRef.current!.scrollIntoView({ behavior: 'auto' });
    const timeout = setTimeout(
      () => lastMessageRef.current!.scrollIntoView({ behavior: 'auto' }),
      100
    );
    return () => clearTimeout(timeout);
  }, [messages, isChatLoading, lastMessageRef]);

  return (
    <div
      id='chat-messages'
      className='z-10 flex w-full flex-col gap-5 border-t-[45px] border-primary p-5'
    >
      {messages.map((element, index) => (
        <Message key={index} {...element} />
      ))}
      <div ref={lastMessageRef} className='text-[0px] text-transparent'>
        A{/* has to add some dummy text here, else Vite will not render */}
      </div>
    </div>
  );
};

export default ChatMessages;
