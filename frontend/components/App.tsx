import React from 'react';
import { Toggle } from './buttons/Toggle';

const App: React.FC<any> = ({ props: _props }) => {
  return (
    <div className='fixed bottom-5 right-5 z-[1000] flex'>
      <Toggle />
    </div>
  );
};

export default App;
