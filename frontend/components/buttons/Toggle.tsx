import { X } from 'lucide-react';
import React from 'react';

export const Toggle: React.FC<any> = ({ props }) => {
  return (
    <button className='border-none border-0 p-2 bg-white rounded-full flex shadow-sm hover:scale-105'>
      <X className='h-10 w-10 text-red-500' />
    </button>
  );
};
