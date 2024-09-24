// App.tsx
import React from 'react';

import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ActionButton from './Components/ActionButtonComponent/ActionButton';

function App() {
  const handleClick = () => alert('Button clicked!');

  return (
    <div className="p-4 space-y-4 ">
      <ActionButton label="New Email" icon={<FaPlus />} onClick={handleClick} />
      
    </div>
  );
}

export default App;
