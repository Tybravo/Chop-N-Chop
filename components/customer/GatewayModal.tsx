import React, { useState } from 'react';
import { useOrderContext } from '../store/useOrderContext';
import { useRouter } from 'next/router'; 

export default function GatewayModal() {
  const [step, setStep] = useState<'LOCATION' | 'TIME'>('LOCATION');
  const { location, setLocation, deliveryWindow, setDeliveryWindow, confirmGateway } = useOrderContext();
  const router = useRouter();

  // Mock data - this would eventually come from your backend
  const availableZones = ['Yaba - Akoka', 'Gbagada', 'Surulere'];
  const deliveryWindows = [
    { id: 'today-lunch', title: 'Today • Lunch', time: '12:00 PM - 2:00 PM', status: 'AVAILABLE' },
    { id: 'today-dinner', title: 'Today • Dinner', time: '6:00 PM - 8:00 PM', status: 'CLOSING SOON' },
    { id: 'tomorrow-lunch', title: 'Tomorrow • Lunch', time: '12:00 PM - 2:00 PM', status: 'AVAILABLE' }
  ];

  const handleLocationSelect = (zone: string) => {
    setLocation(zone);
    setStep('TIME');
  };

  const handleWindowSelect = (windowId: string) => {
    setDeliveryWindow(windowId);
  };

  const handleComplete = () => {
    if (location && deliveryWindow) {
      confirmGateway();
      router.push('/customer/home');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] max-h-[600px]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-[#FF6B00] text-white">
          <h2 className="text-2xl font-bold">
            {step === 'LOCATION' ? 'Where are you?' : 'When do you want it?'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {step === 'LOCATION' 
              ? 'Select your zone to see available meals.' 
              : 'Choose a delivery drop window.'}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          
          {step === 'LOCATION' && (
            <div className="space-y-3">
              {availableZones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => handleLocationSelect(zone)}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-[#FF6B00] hover:shadow-sm transition-all text-gray-800 font-medium"
                >
                  📍 {zone}
                </button>
              ))}
            </div>
          )}

          {step === 'TIME' && (
            <div className="space-y-4">
              {deliveryWindows.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleWindowSelect(slot.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    deliveryWindow === slot.id 
                      ? 'border-[#FF6B00] bg-orange-50 ring-2 ring-[#FF6B00]/20' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{slot.title}</p>
                      <p className="text-sm text-gray-500 mt-1">🕒 {slot.time}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      slot.status === 'AVAILABLE' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'TIME' && (
          <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
            <button 
              onClick={() => setStep('LOCATION')}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              Back
            </button>
            <button 
              onClick={handleComplete}
              disabled={!deliveryWindow}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              See Menu
            </button>
          </div>
        )}

      </div>
    </div>
  );
}