import React from 'react';

import { FaHome, FaBell } from 'react-icons/fa';  
import Icon from './Components/IconComponent';



const App: React.FC = () => {
  return (
    <div className="ml-8">
  
      <Icon
        icon="fas fa-home"  
        title="Home"
        size="large"  
        color="blue"  
        position="left"  
        onClick={() => alert('Home icon clicked!')} 
      />

      <Icon 
        icon={FaBell}  
        title="Notifications"
        size={24}  
        color="red"  
        position="right"  
        onClick={() => alert('Notifications icon clicked!')} 
      />

      
      <Icon
        icon="fas fa-cog"  
        size="small" 
        color="green" 
        onClick={() => alert('Settings icon clicked!')}  
      />

      
    </div>
  );
};

export default App;
