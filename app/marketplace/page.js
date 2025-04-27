   'use client';
   
   import Navbar from '../../components/Navbar';
   import { useWeb3 } from '../../context/Web3Context';
   
   export default function Marketplace() {
     const { isConnected } = useWeb3();
     
     // Mock data for now
     const mockDishes = [
       {
         id: 1,
         name: "Organic Vegan Bowl",
         mainComponent: "Local Vegetables",
         carbonCredits: 25,
         price: "0.01 ETH"
       },
       {
         id: 2,
         name: "Sustainable Fish Tacos",
         mainComponent: "MSC Certified Fish",
         carbonCredits: 40,
         price: "0.015 ETH"
       },
       {
         id: 3,
         name: "Farm-to-Table Salad",
         mainComponent: "Seasonal Greens",
         carbonCredits: 15,
         price: "0.008 ETH"
       }
     ];
     
     return (
       <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
         <Navbar />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="text-center mb-12">
             <h1 className="text-3xl font-bold text-gray-900">Sustainable Dish Marketplace</h1>
             <p className="mt-4 text-lg text-gray-600">Browse eco-friendly dishes from verified restaurants</p>
           </div>
           
           {!isConnected && (
             <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
               <p className="text-yellow-700">Connect your wallet to purchase dishes and earn rewards</p>
             </div>
           )}
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {mockDishes.map((dish) => (
               <div key={dish.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                 <div className="p-6">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-xl font-semibold text-gray-900">{dish.name}</h3>
                       <p className="text-sm text-gray-600 mt-1">Main ingredient: {dish.mainComponent}</p>
                     </div>
                     <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                       {dish.carbonCredits} carbon credits
                     </div>
                   </div>
                   
                   <div className="mt-4 flex items-center">
                     <span className="text-lg font-bold text-gray-900">{dish.price}</span>
                   </div>
                   
                   <div className="mt-6">
                     {isConnected ? (
                       <button
                         className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                       >
                         Purchase Dish
                       </button>
                     ) : (
                       <p className="text-sm text-gray-500 text-center">Connect wallet to purchase</p>
                     )}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </main>
     );
   }
