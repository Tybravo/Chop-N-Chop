"use client";

import React, { useState, useEffect } from 'react';
import { useOrderContext } from '@/store/useOrderContext';
import { customerApiClient } from "@/lib/api/customerApiClient";
import { Loader2, MapPin, Clock, ChevronRight, ArrowLeft } from "lucide-react";

// --- API Types ---
interface TimeObj {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface DropSlot {
  id: string;
  startTime: TimeObj;
  endTime: TimeObj;
  full: boolean;
}

interface DailyDrop {
  id: string;
  date: string;
  openTime: string;
  closeTime: string;
  status: string;
  slots: DropSlot[];
}

interface DeliveryWindowUI {
  id: string;
  title: string;
  time: string;
  status: 'AVAILABLE' | 'FULL';
  isFull: boolean;
}

const formatTime = (timeObj: TimeObj) => {
  if (!timeObj) return "";
  const h = timeObj.hour;
  const m = timeObj.minute;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  const formattedMin = m.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMin} ${ampm}`;
};

export default function GatewayModal({ onClose }: { onClose: () => void }) {
  const { location, setLocation, deliveryWindow, setDeliveryWindow, confirmGateway } = useOrderContext();

  const [step, setStep] = useState<'LOCATION' | 'TIME'>('LOCATION');
  const [isLoadingDrops, setIsLoadingDrops] = useState(false);
  const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindowUI[]>([]);
  
  // Local state to hold selections before confirming
  const [tempLocation, setTempLocation] = useState(location || "");
  const [tempWindow, setTempWindow] = useState(deliveryWindow || "");

  const availableZones = ['Yaba - Akoka', 'Gbagada', 'Surulere'];

  // Fetch time slots when moving to the TIME step
  useEffect(() => {
    if (step === 'TIME' && tempLocation) {
      const fetchDrops = async () => {
        setIsLoadingDrops(true);
        setTempWindow(""); 
        
        try {
          const res = await customerApiClient.get(`/api/v1/drops/today?zone=${encodeURIComponent(tempLocation)}`);
          const data: DailyDrop = res.data;

          if (data && data.slots && data.slots.length > 0) {
            const mappedSlots = data.slots.map((slot, index) => {
              const timeStr = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
              let title = "Delivery Drop";
              if (slot.startTime.hour < 12) title = "Morning Drop";
              else if (slot.startTime.hour < 16) title = "Lunch Drop";
              else title = "Dinner Drop";

              return {
                id: slot.id || `fallback-id-${index}`,
                title: `Today • ${title}`,
                time: timeStr,
                status: slot.full ? 'FULL' : 'AVAILABLE',
                isFull: slot.full
              } as DeliveryWindowUI;
            });
            setDeliveryWindows(mappedSlots);
          } else {
            setDeliveryWindows([]);
          }
        } catch (error) {
          console.error("Failed to fetch drops for gateway:", error);
          setDeliveryWindows([]); 
        } finally {
          setIsLoadingDrops(false);
        }
      };

      fetchDrops();
    }
  }, [step, tempLocation]);

  const handleLocationSelect = (zone: string) => {
    setTempLocation(zone);
    setStep('TIME');
  };

  const handleComplete = () => {
    if (tempLocation && tempWindow) {
      setLocation(tempLocation);
      setDeliveryWindow(tempWindow);
      if (confirmGateway) confirmGateway();
      onClose();
    }
  };

  // Failsafe bypass for development if the backend crashes
  const handleBypass = () => {
    setLocation(tempLocation || availableZones[0]);
    setDeliveryWindow("mock-window");
    if (confirmGateway) confirmGateway();
    onClose();
  };

  return (
    // Centered fixed overlay for both mobile and desktop
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* Centered Modal Container */}
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        
        {/* Header Area */}
        <div className="p-6 border-b border-orange-500/20 bg-[#FC6B31] text-white relative shrink-0">
          {step === 'TIME' && (
            <button 
              onClick={() => setStep('LOCATION')}
              className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          )}
          
          <h2 className="text-[24px] font-black tracking-tight pr-8 leading-tight">
            {step === 'LOCATION' ? 'Where are you?' : 'When do you want it?'}
          </h2>
          <p className="text-white/90 text-[14px] mt-2 font-medium">
            {step === 'LOCATION' 
              ? 'Select your delivery zone to see available meals.' 
              : `Showing available drops for ${tempLocation}.`}
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto bg-gray-50/50">
          
          {/* STEP 1: Location Cards */}
          {step === 'LOCATION' && (
            <div className="space-y-3.5 animate-in slide-in-from-left-4 duration-300">
              {availableZones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => handleLocationSelect(zone)}
                  className="w-full flex items-center justify-between p-4 rounded-[20px] border border-gray-200 bg-white hover:border-[#FC6B31] hover:shadow-[0_4px_20px_rgba(252,107,49,0.08)] transition-all text-gray-800 active:scale-[0.98] shadow-sm group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#FC6B31] group-hover:bg-[#FC6B31] group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-[16px] font-bold">{zone}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FC6B31] transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Time Slots */}
          {step === 'TIME' && (
            <div className="space-y-3.5 animate-in slide-in-from-right-4 duration-300">
              {isLoadingDrops ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 text-[#FC6B31] animate-spin mb-3" />
                  <p className="text-[13px] font-bold text-gray-500">Finding delivery slots...</p>
                </div>
              ) : deliveryWindows.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-[20px] border border-gray-100 shadow-sm px-4">
                  <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-900 font-bold text-[16px] mb-1">No drops available</p>
                  <p className="text-gray-500 font-medium text-[14px] mb-6">There are no more scheduled drops for {tempLocation} today.</p>
                  
                  {/* Failsafe bypass button for testing */}
                  <button 
                    onClick={handleBypass}
                    className="w-full py-4 rounded-[16px] font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors text-[15px]"
                  >
                    Browse Menu Anyway
                  </button>
                </div>
              ) : (
                deliveryWindows.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => !slot.isFull && setTempWindow(slot.id)}
                    disabled={slot.isFull}
                    className={`w-full text-left p-4 rounded-[20px] border transition-all ${
                      slot.isFull 
                        ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                        : tempWindow === slot.id 
                          ? 'border-[#FC6B31] bg-orange-50 ring-2 ring-[#FC6B31]/20 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3.5">
                        <div className={`mt-0.5 ${tempWindow === slot.id ? 'text-[#FC6B31]' : 'text-gray-400'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-extrabold text-[16px] ${slot.isFull ? 'text-gray-500' : 'text-gray-900'}`}>
                            {slot.title}
                          </p>
                          <p className="text-[14px] font-medium text-gray-500 mt-1">
                            {slot.time}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${
                        slot.isFull 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'TIME' && deliveryWindows.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <button 
              onClick={handleComplete}
              disabled={!tempLocation || !tempWindow || isLoadingDrops}
              className="w-full py-4.5 rounded-[18px] font-bold text-[16px] text-white bg-[#FC6B31] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
            >
              See Menu
            </button>
          </div>
        )}

      </div>
    </div>
  );
}