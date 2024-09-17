
import ProceedButton from "./Components/ProceedButtonComponent";
import "./index.css";


const App: React.FC = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="p-4">
      <ProceedButton onClick={handleClick} text="Proceed" />
    </div>
  );
};

export default App;

