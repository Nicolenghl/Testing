'use client';

import './globals.css';
import { Web3Provider } from './context/Web3Context';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const [ethersLoaded, setEthersLoaded] = useState(false);

  useEffect(() => {
    // Check if ethers already exists
    if (typeof window !== 'undefined' && window.ethers) {
      setEthersLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.ethers.io/lib/ethers-5.7.umd.min.js';
    script.async = false; // Important: load synchronously
    
    // Set onload handler
    script.onload = () => {
      console.log("Ethers.js loaded successfully");
      setEthersLoaded(true);
    };
    
    // Handle loading errors
    script.onerror = () => {
      console.error("Failed to load ethers.js");
    };
    
    // Add to document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {ethersLoaded ? (
          <Web3Provider>
            {children}
          </Web3Provider>
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '20px' }}>Loading Web3 libraries...</div>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </body>
    </html>
  );
}
