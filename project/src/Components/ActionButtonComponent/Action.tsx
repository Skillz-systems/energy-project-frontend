import React from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import ActionButton from './ActionButton';


function Action() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ActionButton
        label="New Agent"
        icon={<IoAddCircleOutline />}
        variant="primary"
        size="large"
        onClick={handleClick}
        iconAlignment="left"
        padding="px-2 py-1"
        margin="mx-2"
        height="h-8"
      />
    </div>
  );
}

export default Action;
