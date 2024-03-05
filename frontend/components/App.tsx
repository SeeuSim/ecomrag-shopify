import { useState } from 'react'
import { X } from 'lucide-react';

function App() {
  const [open, setIsOpen] = useState(false);

  return (
    <>
      <div className='h-4 w-4 rounded-full' onClick={() => setIsOpen((_open) => !_open)}>
        <img src='assets/assistant.jpg' className={open? 'hidden' : ''} />
        <X className={open? '' : 'hidden'} />
      </div>
    </>
  )
}

export default App
