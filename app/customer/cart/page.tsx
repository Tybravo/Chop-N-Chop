"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Edit2, CheckCircle2, X, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; // Import global Zustand cart store

export default function CartPage() {
  const router = useRouter();

  // --- Global Store State ---
  const { items: cartItems, updateQuantity, removeFromCart } = useCartStore();

  // --- Local UI State ---
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Modal & Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
const [addressForm, setAddressForm] = useState({ type: "", location: "" });
  
  const typeInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLTextAreaElement>(null);
  
  // --- Address State (Specific location within the pre-selected Zone) ---
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", location: "14 Allen Avenue, Ikeja, Lagos" },
    { id: 2, type: "Office", location: "Herbert Macaulay Way, Yaba, Lagos" },
  ]);

  // --- Handlers ---
  
  // Smart 2-Step Delete Logic linked to global store
  const handleQuantityChange = (id: number | string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (delta === -1 && item.quantity === 1) {
      if (deleteConfirmId === id) {
        // Step 2: Confirm Delete (Bin was tapped) -> completely removes item
        if (typeof removeFromCart === "function") {
          removeFromCart(id);
        } else {
          updateQuantity(id, 0); // Fallback if store uses updateQuantity for removal
        }
        setDeleteConfirmId(null);
      } else {
        // Step 1: Intend to Delete (Minus tapped at qty 1, show bin icon)
        setDeleteConfirmId(id);
      }
    } else {
      // Normal increment/decrement - ALWAYS clear delete confirmation on any other action
      setDeleteConfirmId(null);
      updateQuantity(id, newQty);
    }
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({ type: "", location: "" });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (e: React.MouseEvent, addr: { id: number, type: string, location: string }) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setAddressForm({ type: addr.type, location: addr.location });
    setIsAddressModalOpen(true);
    // Move cursor to end after render
    setTimeout(() => {
      typeInputRef.current?.setSelectionRange(addr.type.length, addr.type.length);
      locationInputRef.current?.setSelectionRange(addr.location.length, addr.location.length);
    }, 0);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.type.trim() || !addressForm.location.trim()) return;

    if (editingAddressId !== null) {
      setAddresses(prev => prev.map(a => 
        a.id === editingAddressId ? { ...a, type: addressForm.type, location: addressForm.location } : a
      ));
    } else {
      const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
      const newAddress = { id: newId, type: addressForm.type, location: addressForm.location };
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newId);
    }
    
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setAddressForm({ type: "", location: "" });
  };

  const handleBackNavigation = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/customer/home');
    }
  };

  // --- Consolidated Hub Pricing Engine ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const packagingFee = cartItems.length > 0 ? 500 : 0; 
  const deliveryFee = cartItems.length > 0 ? 1500 : 0; 
  const total = subtotal + (cartItems.length > 0 ? packagingFee + deliveryFee : 0);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-64 relative">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
        <button 
          onClick={handleBackNavigation} 
          className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Your Cart</h1>
        <div className="w-9" />
      </header>

      <div className="px-5 md:px-8 max-w-3xl mx-auto pt-6 space-y-8">
        
        {/* --- CART ITEMS LIST --- */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-[24px] border border-gray-50 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Your cart is empty</h3>
              <p className="text-[13px] text-gray-500 mt-1">Looks like you haven&apos;t added any meals yet.</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const isConfirmingDelete = deleteConfirmId === item.id;

              return (
                <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-zinc-900 p-3.5 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-black/20 border border-gray-50 dark:border-zinc-800 transition-all">
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
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="w-7 h-7 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-600 shadow-sm hover:text-[#FC6B31] shrink-0 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center pt-0.5">
                      <span className="font-bold text-[13px] text-gray-900 dark:text-white leading-none tabular-nums">
                        {item.quantity}
                      </span>
                    </div>
                    
                    {/* 2-Step UI Swap based on deletion intent state */}
                    <button 
                      onClick={() => handleQuantityChange(item.id, -1)} 
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm
                        ${isConfirmingDelete 
                          ? 'text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20' 
                          : 'text-gray-400'
                        }`}
                    >
                      {isConfirmingDelete ? (
                        <Trash2 className="w-3.5 h-3.5 animate-in zoom-in duration-200" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- EXACT DELIVERY ADDRESS SELECTION --- */}
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Drop-off Address</h3>
            <button 
              onClick={openAddAddress}
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

                <button 
                  onClick={(e) => openEditAddress(e, addr)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
                  aria-label={`Edit ${addr.type} address`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ADD/EDIT ADDRESS MODAL --- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">
                {editingAddressId ? "Edit Drop-off Address" : "Add Drop-off Address"}
              </h3>
              <button 
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setEditingAddressId(null);
                }} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Label</label>
                <input 
                  ref={typeInputRef}
                  type="text" 
                  required 
                  value={addressForm.type}
                  onChange={e => setAddressForm({ ...addressForm, type: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] dark:focus:border-[#FC6B31] transition-colors"
                  placeholder="e.g., Office, Home" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Address</label>
                <textarea 
                  ref={locationInputRef}
                  required 
                  rows={3}
                  value={addressForm.location}
                  onChange={e => setAddressForm({ ...addressForm, location: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] dark:focus:border-[#FC6B31] transition-colors resize-none"
                  placeholder="Enter street address, building, apartment..." 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#FC6B31] text-white font-bold text-[15px] py-3.5 rounded-xl mt-2 hover:bg-[#e35014] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
              >
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FIXED BOTTOM CHECKOUT BAR --- */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 p-4 pb-safe-offset-4 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Consolidated Cost Breakdown */}
            <div className="space-y-1.5 mb-2 px-1">
              <div className="flex justify-between items-center text-[13px] text-gray-500 dark:text-gray-400">
                <span>Food Total</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-gray-500 dark:text-gray-400">
                <span>Packaging & Consolidation</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">₦{packagingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-gray-500 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">₦{deliveryFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-1 text-[15px] pt-2 border-t border-gray-100 dark:border-zinc-800/50">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Total Payment</span>
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
      )}

    </div>
  );
}