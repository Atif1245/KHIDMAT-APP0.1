import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';

const ProviderJobs: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button 
        onClick={() => navigate('/provider-dashboard')} 
        className="flex items-center gap-2 text-emerald-600 mb-4 hover:text-emerald-700"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="w-8 h-8 text-emerald-600" />
        <h1 className="text-2xl font-bold">My Jobs</h1>
      </div>
      <p className="text-gray-500">Your job list will appear here</p>
    </div>
  );
};
export default ProviderJobs;