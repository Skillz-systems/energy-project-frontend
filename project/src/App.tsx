import Icon from "./Components/IconComponent";
import { FaHome,  } from 'react-icons/fa';


const App: React.FC = () => {
  return (
    <div className="p-8">
     
      <Icon
        icon={FaHome}  
        title="Home"
        size="medium"
        color="blue"
        position="right"
        onClick={() => alert('Home icon clicked!')}
        className="bg-gray-100 p-4 rounded-lg"
        titleClassName="text-blue-500"
        iconClassName="text-blue-700"
      />

     
    </div>
  );
};

export default App;
