import { useContext, useEffect, useRef } from 'react';

import { Message } from '@/components/sections/chat/Message';
import { ChatMessagesContext } from './utils';

const ChatMessages = () => {
  const { messages } = useContext(ChatMessagesContext);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatWindow = document.getElementById('chat-container')!;
    const resizeObserver = new ResizeObserver(() => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
    const mutationObserver = new MutationObserver(() => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
    resizeObserver.observe(chatWindow);
    mutationObserver.observe(chatWindow, {
      childList: true,
      subtree: true,
    });
    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      id='chat-messages'
      className='z-10 flex w-full flex-col gap-5 border-t-[45px] border-primary p-5'
    >
      {messages.map((element, index) => (
        <Message key={index} {...element} />
      ))}
      <div ref={lastMessageRef} id='chat-last-child' className='text-[0px] text-transparent'>
        A{/* has to add some dummy text here, else Vite will not render */}
      </div>
    </div>
  );
};

export default ChatMessages;
