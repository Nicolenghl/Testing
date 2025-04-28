'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const Web3Context = createContext({
  connect: async () => {},
  disconnect: () => {},
  account: null,
  contract: null,
  isConnected: false,
  isRestaurant: false,
  loading: false
});

export const useWeb3 = () => useContext(Web3Context);

// Replace with your actual deployed contract address
const CONTRACT_ADDRESS = '0x4C111d82caa78dD55eBbd89CE1D4CdE777Ae27E5';

// Basic ABI for your contract functions
const CONTRACT_ABI = [
  // Basic queries
  "function getDishes() view returns (uint[])",
  "function getDishDetails(uint) view returns (string, string, uint, uint, address, bool, bool)",
  "function verifiedRestaurants(address) view returns (bool)",
  "function getCustomerCarbonCredits() view returns (uint)",
  "function getCustomerTokenBalance() view returns (uint)",
  
  // Transactions
  "function purchaseDishWithEth(uint) payable",
  "function rateDish(uint, uint, string)",
  "function registerRestaurant(uint8, string) payable",
  "function registerDish(string, string, uint, uint)",
  
  // Additional queries
  "function getUserTransactions(uint, uint) view returns (tuple(uint, uint, uint, uint)[])",
  "function userTransactionCount(address) view returns (uint)",
  "function restaurantDishes(address) view returns (uint[])"
];

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ethersLoaded, setEthersLoaded] = useState(false);
  
  // Check if ethers is loaded from CDN
  useEffect(() => {
    function checkEthersLoaded() {
      if (typeof window !== 'undefined' && window.ethers) {
        setEthersLoaded(true);
      } else {
        setTimeout(checkEthersLoaded, 500);
      }
    }
    
    checkEthersLoaded();
  }, []);
  
  const connect = async () => {
  console.log("Connect function called");
  
  // Check if ethers is loaded
  if (typeof window === 'undefined' || !window.ethers) {
    console.error("Ethers library not loaded yet");
    alert("Web3 libraries are still loading. Please try again in a moment.");
    return;
  }
  
  // Check if MetaMask is installed
  if (typeof window.ethereum === 'undefined') {
    console.error("MetaMask not installed");
    alert('Please install MetaMask to use this application');
    return;
  }
  
  try {
    setLoading(true);
    console.log("Requesting accounts...");
    
    // Request accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      console.error("No accounts returned");
      alert("Failed to get accounts from MetaMask. Please make sure MetaMask is unlocked.");
      setLoading(false);
      return;
    }
    
    const connectedAccount = accounts[0];
    console.log("Connected account:", connectedAccount);
    
    // Create provider
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Set state
    setAccount(connectedAccount);
    setIsConnected(true);
    
    // Simple contract check first
    if (CONTRACT_ADDRESS) {
      try {
        console.log("Creating contract instance...");
        const contractInstance = new window.ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        
        setContract(contractInstance);
        
        // Check restaurant status
        try {
          const status = await contractInstance.verifiedRestaurants(connectedAccount);
          setIsRestaurant(status);
        } catch (err) {
          console.error("Error checking restaurant status:", err);
        }
      } catch (err) {
        console.error("Error creating contract instance:", err);
      }
    }
    
    // MetaMask event listeners
    window.ethereum.on('accountsChanged', (newAccounts) => {
      console.log("Accounts changed:", newAccounts);
      if (newAccounts.length === 0) {
        disconnect();
      } else {
        setAccount(newAccounts[0]);
      }
    });
    
  } catch (error) {
    console.error("Wallet connection error:", error);
    alert(`Failed to connect wallet: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
  
  const disconnect = () => {
    setAccount(null);
    setContract(null);
    setIsConnected(false);
    setIsRestaurant(false);
  };
  
  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        account,
        contract,
        isConnected,
        isRestaurant,
        loading
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
