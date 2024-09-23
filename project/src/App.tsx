import React from 'react';
import PageBanner from './PageBannerComponent/PageBannerComponent';


function App() {
  return (
    <div className="App">
      <PageBanner
        title="Welcome to Our Platform"
        subtitle="Bringing you the best services."
        backgroundImage="/path-to-your-background-image.jpg"
        backgroundColor="#1a202c"
        buttonText="Get Started"
        buttonLink="#"
        overlayOpacity={0.6}
      />
    </div>
  );
}

export default App;
