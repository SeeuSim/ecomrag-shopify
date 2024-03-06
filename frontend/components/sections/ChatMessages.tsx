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
    <div className='flex w-full flex-col gap-5 p-5'>
      {Array.apply(null, Array(10))
        .flatMap((_) => messages)
        .map((element, index) => (
          <Message key={index} {...element} />
        ))}
      {/* <div className='h-5 w-full flex-shrink-0' /> */}
    </div>
  );
};

export default ChatMessages;
