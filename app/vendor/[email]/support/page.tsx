"use client";

import { useState } from "react";
import { supportService } from "@/services/vendor/support.service";
import { HelpCircle, MessageSquare, PhoneCall, Mail, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I update my menu?", a: "Go to the 'View Meals' section from the sidebar, where you can edit existing meals or use 'Add Meal' to create new ones." },
    { q: "When do I get my payouts?", a: "Payouts are processed automatically every Tuesday for orders completed in the previous week, provided your KYC is verified." },
    { q: "How do I contact a rider?", a: "Once an order is marked as 'Out for Delivery', the rider's contact details will be visible in the Order Details drawer." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      await supportService.createTicket(subject, message);
      setSuccess("Support ticket submitted successfully. We'll get back to you soon.");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="admin-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 text-[#FC6B31] rounded-full flex items-center justify-center mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Call Us</h3>
          <p className="text-sm text-gray-500 mt-1">+234 800 000 0000</p>
        </div>
        <div className="admin-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
          <p className="text-sm text-gray-500 mt-1">support@chopnchop.com</p>
        </div>
        <div className="admin-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
          <p className="text-sm text-gray-500 mt-1">Available 9 AM - 6 PM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Ticket Form */}
        <div className="admin-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FC6B31]" /> Submit a Ticket
          </h3>
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="admin-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <button 
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-medium text-sm text-left text-gray-900 dark:text-white">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 py-3 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
