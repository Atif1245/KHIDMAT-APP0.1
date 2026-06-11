import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user, language, t } = useApp();
  const [formData, setFormData] = useState({
    name: profile?.name || user?.name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send to backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/customer-home');
    }, 2000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'atifsial5510@gmail.com', link: 'mailto:atifsial5510@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+92 308 5228520', link: 'tel:+923085228520' },
    { icon: MapPin, label: 'Address', value: 'Islamabad, Pakistan', link: 'https://maps.google.com/?q=Islamabad' },
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
            {language === 'en' ? 'Contact Us' : 'ہم سے رابطہ کریں'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <a
                key={idx}
                href={info.link}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{info.label}</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{info.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Contact Form */}
        {!submitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'en' ? 'Send us a message' : 'ہمیں پیغام بھیجیں'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Your Name' : 'آپ کا نام'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-emerald-500"
                  placeholder={language === 'en' ? 'Enter your name' : 'اپنا نام لکھیں'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Email Address' : 'ای میل ایڈریس'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-emerald-500"
                  placeholder="atifsial5510@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Phone Number' : 'فون نمبر'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-emerald-500"
                  placeholder="+92 308 5228520"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Message' : 'پیغام'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder={language === 'en' ? 'How can we help you?' : 'ہم آپ کی کس طرح مدد کر سکتے ہیں؟'}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
              >
                <Send size={18} />
                {language === 'en' ? 'Send Message' : 'پیغام بھیجیں'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'en' ? 'Message Sent!' : 'پیغام بھیج دیا گیا!'}
            </h3>
            <p className="text-gray-500">
              {language === 'en' 
                ? 'Thank you for contacting us. We will get back to you soon.' 
                : 'ہم سے رابطہ کرنے کا شکریہ۔ ہم جلد آپ سے رابطہ کریں گے۔'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;