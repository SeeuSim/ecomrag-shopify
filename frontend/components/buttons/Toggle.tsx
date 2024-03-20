import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

export const Toggle: React.FC = () => {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!document) {
      return;
    }
    var root = document.getElementById('root');
    var imgSrcActual = root?.dataset.logoSrc;
    if (imgSrcActual && imgSrcActual.length > 0) {
      setImgSrc(imgSrcActual);
    }
  }, []);

  return (
    <div
      className={cn(
        'z-[1050] h-20 w-20 cursor-pointer',
        'items-center justify-center rounded-full',
        'border border-border bg-background p-4 shadow-md',
        'duration-150 ease-in-out hover:scale-105',
        'hover:bg-background'
      )}
    >
      {imgSrc ? (
        <img src={imgSrc} height={30} width={30} loading='lazy' />
      ) : (
        <Loader2 className='animate-spin' />
      )}
    </div>
  );
};
