   'use client';


   import GreenDishABI from '../contracts/GreenDish.json';

   // Create context
   const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenDishABI.abi, signer);
   
   export const useWeb3 = () => useContext(Web3Context);
   
   // Contract address - replace with your deployed contract address
   const CONTRACT_ADDRESS = '0x4C111d82caa78dD55eBbd89CE1D4CdE777Ae27E5';
   
   export function Web3Provider({ children }) {
     const [account, setAccount] = useState(null);
     const [isConnected, setIsConnected] = useState(false);
     const [isRestaurant, setIsRestaurant] = useState(false);
     const [loading, setLoading] = useState(false);
     
     const connect = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this application');
    return;
  }
  
  try {
    setLoading(true);
    
    // Request accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    // Create ethers provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi, // or GreenDishABI.abi if using Option B
      signer
    );
    
    setProvider(provider);
    setSigner(signer);
    setAccount(account);
    setContract(contract);
    setIsConnected(true);
    
    // Check if connected account is a verified restaurant
    try {
      const isVerified = await contract.verifiedRestaurants(account);
      setIsRestaurant(isVerified);
    } catch (error) {
      console.error("Error checking restaurant status:", error);
      setIsRestaurant(false);
    }
    
    // Event listeners
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0] || null);
      window.location.reload();
    });
    
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    
  } catch (error) {
    console.error("Error connecting wallet:", error);
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
