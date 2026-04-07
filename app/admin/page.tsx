'use client';

import * as React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Settings, RefreshCw, Printer, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/Button';

const MOCK_STATS = [
  { label: 'Active Orders', value: '45', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { label: 'Total Revenue', value: '₦245k', color: 'bg-green-50 text-green-700 border-green-100' },
  { label: 'Sold Out Items', value: '2', color: 'bg-red-50 text-red-700 border-red-100' },
  { label: 'Current Slot', value: '12-1PM', color: 'bg-orange-50 text-orange-700 border-orange-100' },
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-secondary-light/30">
          <span className="text-xl font-black tracking-tight text-secondary-foreground">
            Chop<span className="text-primary">n</span>chop <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded ml-2">OPS</span>
          </span>
        </div>
        <nav className="flex-1 py-6 space-y-2 px-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-secondary-light/30 text-primary rounded-xl font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-light/25 rounded-xl font-medium transition-colors">
            <ShoppingBag size={20} /> Orders Manifest
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-light/25 rounded-xl font-medium transition-colors">
            <Users size={20} /> Customers
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-light/25 rounded-xl font-medium transition-colors">
            <Settings size={20} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-background border-b border-secondary-light/20 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-foreground">Live Kitchen Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <RefreshCw size={14} className="text-primary animate-spin-slow" /> Auto-refreshing
            </span>
            <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm border border-primary/20">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-foreground">Today&apos;s Operations</h2>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer size={16} /> Export Manifest
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-bold shadow-sm">
                <AlertTriangle size={16} /> Close Kitchen
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {MOCK_STATS.map((stat, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border shadow-sm ${stat.color}`}>
                <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Active Orders Table Placeholder */}
          <div className="bg-background rounded-2xl shadow-sm border border-secondary-light/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-light/20 flex justify-between items-center bg-secondary-light/5">
              <h3 className="font-bold text-foreground text-lg">Kitchen Queue</h3>
              <select className="text-sm border-secondary-light/30 rounded-lg text-foreground focus:ring-primary focus:border-primary bg-background shadow-sm font-medium">
                <option>Slot: 12:00 PM - 1:00 PM</option>
                <option>Slot: 1:00 PM - 2:00 PM</option>
              </select>
            </div>
            <div className="p-6 text-center text-foreground/60">
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-12 bg-secondary-light/10 rounded-xl w-full border border-secondary-light/20" />
                <div className="h-12 bg-secondary-light/10 rounded-xl w-full border border-secondary-light/20" />
                <div className="h-12 bg-secondary-light/10 rounded-xl w-full border border-secondary-light/20" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
