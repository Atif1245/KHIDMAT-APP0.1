import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, FileText, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useApp();

  const faqs = [
    { question: 'How do I book a service?', answer: 'Select your city, choose a category, pick a provider, and confirm booking.' },
    { question: 'How to cancel a booking?', answer: 'Go to My Orders, select active order, and click Cancel button.' },
    { question: 'Payment methods accepted?', answer: 'JazzCash, Easypaisa, Credit Card, and Cash on service.' },
    { question: 'How to become a provider?', answer: 'Sign up as Service Provider, complete verification, and start earning.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex-1 text-center">
            {language === 'en' ? 'Help Center' : 'ہیلپ سینٹر'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => navigate('/contact-us')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <MessageCircle size={28} className="text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              {language === 'en' ? 'Live Chat' : 'لیو چیٹ'}
            </p>
          </button>
          <button 
            onClick={() => window.location.href = 'mailto:atifsial5510@gmail.com'}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <Mail size={28} className="text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              {language === 'en' ? 'Email Us' : 'ای میل کریں'}
            </p>
          </button>
        </div>

        {/* FAQs Section */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {language === 'en' ? 'Frequently Asked Questions' : 'اکثر پوچھے گئے سوالات'}
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <p className="font-semibold text-gray-800 dark:text-white mb-2">{faq.question}</p>
              <p className="text-sm text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 text-center">
          <HelpCircle size={32} className="text-emerald-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            {language === 'en' ? 'Still need help?' : 'اب بھی مدد چاہیے؟'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {language === 'en' 
              ? 'Contact our support team for assistance' 
              : 'مدد کے لیے ہماری سپورٹ ٹیم سے رابطہ کریں'}
          </p>
          <button
            onClick={() => navigate('/contact-us')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold"
          >
            {language === 'en' ? 'Contact Support' : 'سپورٹ سے رابطہ کریں'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;