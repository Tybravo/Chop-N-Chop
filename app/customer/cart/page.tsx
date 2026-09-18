"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, MapPin, Navigation, Edit2, CheckCircle2, X } from "lucide-react";

export default function CartPage() {
  const router = useRouter();

  // --- State ---
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ type: "", location: "" });
  
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Melting Cheese Pizza",
      desc: "Pizza • 8'' Small",
      price: 11880,
      quantity: 1,
      image: "/hero-food-illustration.png"
    },
    {
      id: 2,
      name: "Chicken Salad",
      desc: "Healthy • Medium",
      price: 4560,
      quantity: 2,
      image: "/hero-food-illustration.png"
    }
  ]);

  // --- Address State ---
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", location: "14 Allen Avenue, Ikeja, Lagos" },
    { id: 2, type: "Office", location: "Herbert Macaulay Way, Yaba, Lagos" },
  ]);

  // --- Handlers ---
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.type.trim() || !newAddressForm.location.trim()) return;

    const newId = Math.max(...addresses.map(a => a.id)) + 1;
    const newAddress = {
      id: newId,
      type: newAddressForm.type,
      location: newAddressForm.location,
    };
    
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newId); // Auto-select the newly added address
    setIsAddingAddress(false); // Close the modal
    setNewAddressForm({ type: "", location: "" }); // Reset form
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === "delivery" ? 1500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 relative">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Your Chop</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </header>

      <div className="px-5 md:px-8 max-w-3xl mx-auto pt-6 space-y-8">
        
        {/* --- CART ITEMS LIST --- */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-3.5 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-black/20 border border-gray-50 dark:border-zinc-800">
              <div className="w-[85px] h-[85px] bg-gray-100 dark:bg-zinc-800 rounded-[18px] overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                <h3 className="font-bold text-[15px] text-gray-900 dark:text-white truncate">{item.name}</h3>
                <p className="text-[12px] text-gray-500 mb-2 truncate">{item.desc}</p>
                <span className="font-extrabold text-[15px] text-gray-900 dark:text-white">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col items-center justify-between bg-gray-50 dark:bg-zinc-800/50 p-1.5 rounded-full border border-gray-100 dark:border-zinc-700/50 h-[85px] w-[38px] shrink-0">
                <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-600 shadow-sm hover:text-[#FC6B31] shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center pt-0.5">
                  <span className="font-bold text-[13px] text-gray-900 dark:text-white leading-none tabular-nums">
                    {item.quantity}
                  </span>
                </div>
                <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition-all shrink-0">
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- ORDER TYPE TOGGLE --- */}
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-3">Order Type</h3>
          <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-2xl relative">
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold z-10 transition-colors ${
                orderType === "delivery" ? "text-gray-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm" : "text-gray-500"
              }`}
            >
              <Navigation className="w-4 h-4" /> Delivery
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold z-10 transition-colors ${
                orderType === "pickup" ? "text-gray-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm" : "text-gray-500"
              }`}
            >
              <MapPin className="w-4 h-4" /> Pickup
            </button>
          </div>
        </div>

        {/* --- DELIVERY ADDRESS SELECTION --- */}
        {orderType === "delivery" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Delivery Address</h3>
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="text-[13px] font-semibold text-[#FC6B31] hover:text-[#e35014] transition-colors"
              >
                Add New
              </button>
            </div>
            
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`flex items-start gap-4 p-4 rounded-[20px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 ${
                    selectedAddress === addr.id 
                      ? "border-[#FC6B31] shadow-[0_4px_20px_rgba(252,107,49,0.1)]" 
                      : "border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    selectedAddress === addr.id ? "border-[#FC6B31]" : "border-gray-300 dark:border-zinc-700"
                  }`}>
                    {selectedAddress === addr.id && <div className="w-2.5 h-2.5 bg-[#FC6B31] rounded-full" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {addr.type}
                      {selectedAddress === addr.id && <CheckCircle2 className="w-4 h-4 text-[#FC6B31]" />}
                    </h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed mt-0.5 pr-4 truncate">{addr.location}</p>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- ADD NEW ADDRESS MODAL --- */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Add Delivery Address</h3>
              <button 
                onClick={() => setIsAddingAddress(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Label</label>
                <input 
                  type="text" 
                  required 
                  value={newAddressForm.type}
                  onChange={e => setNewAddressForm({ ...newAddressForm, type: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] dark:focus:border-[#FC6B31] transition-colors"
                  placeholder="e.g., Girlfriend's Place, Studio" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Address</label>
                <textarea 
                  required 
                  rows={3}
                  value={newAddressForm.location}
                  onChange={e => setNewAddressForm({ ...newAddressForm, location: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] dark:focus:border-[#FC6B31] transition-colors resize-none"
                  placeholder="Enter street address, building, apartment..." 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#FC6B31] text-white font-bold text-[15px] py-3.5 rounded-xl mt-2 hover:bg-[#e35014] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FIXED BOTTOM CHECKOUT BAR --- */}
      {/* Increased z-index to z-[200] so it sits firmly above any global bottom navigation components */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 p-4 pb-safe-offset-4 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto space-y-4">
          
          <div className="flex justify-between items-center px-2 text-[15px]">
            <span className="font-semibold text-gray-500">Total Payment</span>
            <span className="font-extrabold text-xl text-gray-900 dark:text-white">₦{total.toLocaleString()}</span>
          </div>

          <button 
            type="button"
            onClick={() => router.push('/customer/checkout')} 
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg"
            style={{ padding: '1.125rem' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

    </div>
  );
}