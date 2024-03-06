import { type MessageProps, Message } from '@/components/sections/chat/Message';

const ChatMessages = () => {
  const messages: Array<MessageProps> = [
    {
      role: 'system',
      content: `Hello! Feel free to ask any questions based on your needs! Such as a Y2K fit or looking like a specific celebrity. I'm here to help you find the perfect outfit!`,
    },
    {
      role: 'user',
      content: 'I want something spicy.',
    },
  ];
  return (
    <div className='z-10 flex w-full -translate-y-20 flex-col gap-5 border-t-[5rem] border-primary p-5'>
      {Array.apply(null, Array(10))
        .flatMap((_) => messages)
        .map((element, index) => (
          <Message key={index} {...element} />
        ))}
    </div>
  );
};

export default ChatMessages;
