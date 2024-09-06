// a 

import React from 'react'

const ErrorBoundary: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    return <>{children}</>;
  };
  export default ErrorBoundary