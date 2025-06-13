import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const GreenLottie = () => {
  return (
    <div className="w-full flex justify-center my-12">
      <DotLottieReact
        src="https://lottie.host/e04ba354-bdfe-4a28-ad70-d14a17984699/EmITOLFVvc.lottie"
        loop
        autoplay
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default GreenLottie;
