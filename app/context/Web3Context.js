   'use client';
   
   import { createContext, useContext, useState, useEffect } from 'react';
   
   // Create context
   const Web3Context = createContext({
     connect: async () => {},
     disconnect: () => {},
     account: null,
     isConnected: false,
     isRestaurant: false,
     loading: false
   });
   
   export const useWeb3 = () => useContext(Web3Context);
   
   // Contract address - replace with your deployed contract address
   const CONTRACT_ADDRESS = '0xYourDeployedContractAddressHere';
   
   export function Web3Provider({ children }) {
     const [account, setAccount] = useState(null);
     const [isConnected, setIsConnected] = useState(false);
     const [isRestaurant, setIsRestaurant] = useState(false);
     const [loading, setLoading] = useState(false);
     
     const connect = async () => {
       try {
         setLoading(true);
         
         // Check if MetaMask is installed
         if (typeof window.ethereum === 'undefined') {
           alert('Please install MetaMask to use this application');
           return;
         }
         
         // Request accounts
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         const account = accounts[0];
         
         setAccount(account);
         setIsConnected(true);
         
         // For now, just randomly set isRestaurant
         // Later we'll connect to the actual contract
         setIsRestaurant(Math.random() > 0.5);
         
         // Listen for account changes
         window.ethereum.on('accountsChanged', (accounts) => {
           setAccount(accounts[0] || null);
           setIsConnected(Boolean(accounts[0]));
           if (!accounts[0]) {
             setIsRestaurant(false);
           }
         });
         
       } catch (error) {
         console.error("Error connecting to wallet:", error);
       } finally {
         setLoading(false);
       }
     };
     
     const disconnect = () => {
       setAccount(null);
       setIsConnected(false);
       setIsRestaurant(false);
     };
     
     return (
       <Web3Context.Provider
         value={{
           connect,
           disconnect,
           account,
           isConnected,
           isRestaurant,
           loading
         }}
       >
         {children}
       </Web3Context.Provider>
     );
   }
