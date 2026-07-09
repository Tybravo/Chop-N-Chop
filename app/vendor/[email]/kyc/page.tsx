"use client";

import { useState, useEffect } from "react";
import { kycService } from "@/services/vendor/kyc.service";
import { KycRecord } from "@/types/vendor";
import { Upload, FileText, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

export default function UpdateKycPage() {
  const [records, setRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("Business License");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await kycService.getKycRecords();
      setRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newRecord = await kycService.uploadDocument(selectedDocType, file);
      setRecords([newRecord, ...records]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "VERIFIED": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "REJECTED": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verification</h1>
      
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Documents</h3>
        <p className="text-sm text-gray-500 mb-6">Upload required documents to verify your business identity and receive payouts.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
            <select 
              value={selectedDocType} 
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
            >
              <option value="Business License">Business License (CAC)</option>
              <option value="Government ID">Government Issued ID</option>
              <option value="Utility Bill">Utility Bill (Proof of Address)</option>
            </select>
          </div>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              {uploading ? (
                <Loader2 className="mx-auto h-12 w-12 text-[#FC6B31] animate-spin" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#FC6B31] hover:text-[#e35014]">
                  <span>Upload a file</span>
                  <input type="file" className="sr-only" onChange={handleFileUpload} accept=".pdf,.jpg,.png" disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submission History</h3>
        
        {loading ? (
          <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-[#FC6B31]" /></div>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <div key={record.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{record.documentType}</p>
                    <p className="text-xs text-gray-500">{new Date(record.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{record.status}</span>
                  {getStatusIcon(record.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
