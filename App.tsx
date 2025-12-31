/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ArrowDownRight, MoveRight, Star, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'House Cleaning',
    address: '',
    datetime: '',
    message: ''
  });
  
  // Validation and Error State
  const [formErrors, setFormErrors] = useState<{datetime?: string}>({});
  
  // Fallback UI State (for popup blockers)
  const [showFallback, setShowFallback] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user modifies the field
    if (name === 'datetime' && formErrors.datetime) {
      setFormErrors(prev => ({ ...prev, datetime: undefined }));
    }
  };

  const validateForm = () => {
    const errors: {datetime?: string} = {};
    const now = new Date();
    const selectedDate = new Date(formData.datetime);

    if (formData.datetime && selectedDate <= now) {
      errors.datetime = "Please select a future date and time.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const whatsappMessage = `*New Home Service Request*
    
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${formData.service}
*Address:* ${formData.address}
*Date & Time:* ${formData.datetime}
*Instructions:* ${formData.message || 'None'}`;

    const phoneNumber = "923043537785";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    setGeneratedMessage(whatsappMessage);
    
    // Attempt to open WhatsApp
    const newWindow = window.open(url, '_blank');

    // Check if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      setShowFallback(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation Variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } }
  };

  return (
    <div id="top" className="min-h-screen bg-brand-paper text-brand-black font-sans selection:bg-brand-accent selection:text-white">
      
      {/* Fallback Modal for Popup Blockers */}
      {showFallback && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 max-w-lg w-full border-2 border-brand-accent shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-2xl font-bold uppercase text-brand-accent flex items-center gap-2">
                <AlertCircle /> Connection Issue
              </h3>
              <button onClick={() => setShowFallback(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <p className="mb-4 text-gray-700">
              We couldn't open WhatsApp automatically (browser popup blocked). Please send your request manually:
            </p>

            <div className="bg-gray-100 p-4 mb-4 border border-gray-300">
              <span className="text-xs uppercase font-bold text-gray-500 block mb-1">Send to</span>
              <p className="font-mono font-bold text-lg select-all">0304-3537785</p>
            </div>

            <div className="mb-6 relative">
               <span className="text-xs uppercase font-bold text-gray-500 block mb-1">Message</span>
               <textarea 
                 readOnly 
                 value={generatedMessage} 
                 className="w-full h-32 p-3 font-mono text-sm bg-gray-50 border border-gray-300 resize-none focus:outline-none"
               />
               <button 
                 onClick={copyToClipboard}
                 className="absolute top-7 right-2 p-2 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
               >
                 {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
                 {copied ? 'Copied' : 'Copy'}
               </button>
            </div>

            <a 
              href={`https://wa.me/923043537785?text=${encodeURIComponent(generatedMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-brand-accent text-white py-3 font-bold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Try Opening WhatsApp Again <ExternalLink size={16} className="inline ml-1 mb-1"/>
            </a>
          </div>
        </div>
      )}

      {/* Main Hero */}
      <header className="pt-20 md:pt-24 min-h-[85vh] flex flex-col justify-between border-b border-black">
        <div className="px-6 md:px-12 pt-12 md:pt-24 pb-12">
          
          <h1 className="font-display text-6xl md:text-9xl font-bold leading-[0.9] tracking-tighter uppercase mb-8">
            Home <br/>
            Services <br/>
            <span className="text-transparent stroke-text hover:text-brand-accent transition-colors duration-500">Redefined</span>
          </h1>
          
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-6xl"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-lg md:text-xl font-light max-w-md leading-relaxed">
              Professional cleaning, maintenance, and shifting. We bring order to chaos with speed and precision.
            </p>
            <a href="#booking" className="group flex items-center gap-4 border border-black px-8 py-4 uppercase font-bold text-sm tracking-widest hover:bg-black hover:text-white transition-colors">
              Book Appointment <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Marquee Banner */}
        <div className="border-t border-black py-4 overflow-hidden bg-brand-accent text-white whitespace-nowrap">
          <div className="animate-marquee inline-block font-display font-bold text-xl md:text-2xl uppercase tracking-widest">
            <span className="mx-8">House Cleaning</span> • 
            <span className="mx-8">Home Re-Arrangement</span> • 
            <span className="mx-8">AC Cleaning</span> • 
            <span className="mx-8">Shifting Services</span> • 
            <span className="mx-8">Verified Staff</span> • 
            <span className="mx-8">Instant Booking</span> • 
            <span className="mx-8">House Cleaning</span> • 
            <span className="mx-8">Home Re-Arrangement</span> • 
            <span className="mx-8">AC