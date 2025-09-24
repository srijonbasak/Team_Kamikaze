declare module 'lottie-react' {
  import * as React from 'react';
  export interface LottieProps {
    animationData: any;
    loop?: boolean | number;
    autoplay?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onComplete?: () => void;
  }
  const Lottie: React.FC<LottieProps>;
  export default Lottie;
}

declare module '*.json' {
  const value: any;
  export default value;
}
