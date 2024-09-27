import logo from '../assets/images/logo.png';

interface LogoProps {
  variant?: 'nav' | 'auth'; 
  parentClassName?: string; 
  imgClassName?: string;   
}

const LogoComponent = ({ 
  variant = 'nav', 
  parentClassName = '', 
  imgClassName = ''    
}: LogoProps) => {
  const logoStyles = {
    nav: 'w-[32px] h-[32px] rounded-md', 
    auth: 'w-[120px] h-[120px] rounded-full', 
  };

  return (
    <div className={`w-full h-full flex items-center justify-center ${parentClassName}`}>
      <img
        src={logo}
        alt="Company Logo"
        className={`${variant === 'nav' ? logoStyles.nav : logoStyles.auth} ${imgClassName}`} 
      />
    </div>
  );
};

export default LogoComponent;
