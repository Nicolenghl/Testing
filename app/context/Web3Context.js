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
const CONTRACT_ADDRESS = '0xYourActualContractAddressHere';

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
    if (!ethersLoaded) {
      console.log("Ethers not loaded yet");
      return;
    }
    
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application');
      return;
    }
    
    try {
      setLoading(true);
      
      // Request accounts access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedAccount = accounts[0];
      
      // Set up ethers provider
      const provider = new window.ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const contractInstance = new window.ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      
      setAccount(connectedAccount);
      setContract(contractInstance);
      setIsConnected(true);
      
      // Check if the connected account is a restaurant
      try {
        const restaurantStatus = await contractInstance.verifiedRestaurants(connectedAccount);
        setIsRestaurant(restaurantStatus);
      } catch (error) {
        console.error("Error checking restaurant status:", error);
        setIsRestaurant(false);
      }
      
      // Set up event listeners for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          // User disconnected all accounts
          disconnect();
        } else {
          // User switched accounts
          setAccount(newAccounts[0]);
          
          // Check restaurant status for new account
          contractInstance.verifiedRestaurants(newAccounts[0])
            .then(status => setIsRestaurant(status))
            .catch(err => {
              console.error("Error checking restaurant status for new account:", err);
              setIsRestaurant(false);
            });
        }
      });
      
      // Set up event listener for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Failed to connect wallet. Please try again.");
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
