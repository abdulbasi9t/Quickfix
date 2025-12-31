/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowDownRight, MoveRight, Star, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  
  // Validation and Error State
  const [formErrors, setFormErrors] = useState<{datetime?: string}>({});
  
  // Fallback UI State (for popup blockers)
  const [showFallback, setShowFallback] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Scroll Spy logic to detect active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -50% 0px', // Trigger when section is near the center/top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['top', 'about', 'services', 'booking'];
    
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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

  const navLinkClass = (id: string) => `hover:text-brand-accent hover:underline decoration-2 underline-offset-4 transition-all duration-300 cursor-pointer ${activeSection === id ? 'text-brand-accent underline decoration-brand-accent' : ''}`;

  return (
    <div id="top" className="min-h-screen bg-brand-paper text-brand-black font-sans selection:bg-brand-accent selection:text-white">
      
      {/* Absolute Header (Not Sticky) */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-brand-paper border-b border-black flex justify-between items-center h-16 md:h-20 px-6 md:px-12 transition-all">
        <a href="#top" className="font-display font-bold text-2xl tracking-tighter uppercase focus:outline-none">QuickFix<span className="text-brand-accent">.</span></a>
        
        <div className="hidden md:flex gap-12 font-medium uppercase tracking-wide text-xs">
          <a href="#about" className={navLinkClass('about')}>About</a>
          <a href="#services" className={navLinkClass('services')}>Services</a>
          <a href="#booking" className={navLinkClass('booking')}>Contact</a>
        </div>

        <button 
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-2 border border-black hover:bg-black hover:text-white transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-brand-accent z-[60] flex flex-col items-center justify-center animate-in fade-in duration-200">
          <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 p-2 text-white" aria-label="Close Menu">
            <X size={32} />
          </button>
          <div className="flex flex-col gap-8 text-center font-display text-4xl font-bold text-white uppercase">
            <a href="#about" onClick={() => setMenuOpen(false)} className="hover:opacity-80">About</a>
            <a href="#services" onClick={() => setMenuOpen(false)} className="hover:opacity-80">Services</a>
            <a href="#booking" onClick={() => setMenuOpen(false)} className="hover:opacity-80">Book Now</a>
          </div>
        </div>
      )}

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
            <a 
              href="#booking"
              className="group flex items-center gap-4 border border-black px-8 py-4 uppercase font-bold text-sm tracking-widest hover:bg-black hover:text-white transition-colors"
            >
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
            <span className="mx-8">AC Cleaning</span> • 
            <span className="mx-8">Shifting Services</span> • 
          </div>
        </div>
      </header>

      {/* About Grid */}
      <section id="about" className="scroll-mt-24 grid md:grid-cols-2 border-b border-black">
        {/* The Problem */}
        <div className="p-8 md:p-16 md:border-r border-black flex flex-col justify-center min-h-[60vh] border-b md:border-b-0 relative group">
          <div className="max-w-md">
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 transition-transform duration-500 group-hover:-translate-y-2">The <br/> Problem</h2>
            <p className="text-xl leading-relaxed text-gray-600 mb-8">
              Unreliable cleaners. Late movers. Hidden fees. We know the drill. You deserve better than waiting around for service that might not even show up.
            </p>
            <div className="h-2 w-0 bg-brand-accent group-hover:w-24 transition-all duration-500"></div>
          </div>
        </div>
        
        {/* The Solution */}
        <div className="p-8 md:p-16 bg-white flex flex-col justify-center min-h-[60vh] relative">
          <div className="max-w-md">
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 text-brand-accent">The <br/> Solution</h2>
            <p className="text-xl leading-relaxed text-gray-600 mb-10">
              QuickFix is the "Off Menu" choice for home care. We are punctual, professional, and transparent. We don't just clean; we curate your environment.
            </p>
            <ul className="space-y-6 font-display font-bold text-lg uppercase tracking-wide">
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                   <Check size={18} strokeWidth={3} />
                </div>
                <span>100% Background Checked</span>
              </li>
              <li className="flex items-center gap-4 group">
                 <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                   <Check size={18} strokeWidth={3} />
                </div>
                <span>On-Time Guarantee</span>
              </li>
              <li className="flex items-center gap-4 group">
                 <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                   <Check size={18} strokeWidth={3} />
                </div>
                <span>Transparent Pricing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services "Menu" List */}
      <section id="services" className="border-b border-black">
        <div className="p-6 md:p-12 border-b border-black">
          <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter">Service Menu</h2>
        </div>

        <div>
          <ServiceItem 
            number="01" 
            title="House Cleaning" 
            desc="Deep cleaning for kitchens, washrooms, and living spaces. We remove the dust you didn't know existed." 
          />
          <ServiceItem 
            number="02" 
            title="Home Re-Arrangement" 
            desc="Optimize your living space. We help organize furniture and items for better flow and aesthetics." 
          />
          <ServiceItem 
            number="03" 
            title="AC Cleaning" 
            desc="Boost efficiency and air quality. Full service cleaning for split and window units." 
          />
          <ServiceItem 
            number="04" 
            title="Shifting Services" 
            desc="Pack, Load, Move. We handle your belongings with extreme care during relocation." 
            isLast
          />
        </div>
      </section>

      {/* Booking Ticket */}
      <section id="booking" className="grid lg:grid-cols-12 min-h-screen">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-black text-brand-paper p-6 md:p-12 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-5xl font-bold uppercase mb-12">Contact</h2>
            <div className="space-y-12">
              <div>
                <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</span>
                <p className="text-2xl font-display">0304-3537785</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">WhatsApp</span>
                <p className="text-2xl font-display">Instant Response</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Availability</span>
                <p className="text-2xl font-display">Mon - Sun (9AM - 9PM)</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <ArrowDownRight size={64} className="text-brand-accent" />
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-12 md:pt-24">
          <div className="max-w-xl mx-auto">
            <h3 className="font-display text-3xl font-bold uppercase mb-2">Service Request Ticket</h3>
            <p className="text-gray-500 mb-12">Fill out the details below. We will redirect you to WhatsApp to confirm.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Name</label>
                  <input 
                    id="name"
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black focus:outline-none transition-colors font-display text-xl"
                    placeholder="YOUR FULL NAME"
                  />
                </div>
                <div className="group">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Phone</label>
                  <input 
                    id="phone"
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black focus:outline-none transition-colors font-display text-xl"
                    placeholder="0300-0000000"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="service" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Service Type</label>
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black focus:outline-none transition-colors font-display text-xl rounded-none appearance-none"
                >
                  <option>House Cleaning</option>
                  <option>Home Re-Arrangement</option>
                  <option>AC Cleaning</option>
                  <option>Shifting Services</option>
                </select>
              </div>

              <div className="group">
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Location</label>
                <input 
                  id="address"
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black focus:outline-none transition-colors font-display text-xl"
                  placeholder="FULL ADDRESS"
                />
              </div>

              <div className="group">
                <label htmlFor="datetime" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Preferred Time</label>
                <input 
                  id="datetime"
                  type="datetime-local" 
                  name="datetime"
                  required
                  value={formData.datetime}
                  onChange={handleInputChange}
                  aria-invalid={!!formErrors.datetime}
                  aria-describedby={formErrors.datetime ? "datetime-error" : undefined}
                  className={`w-full bg-transparent border-b py-3 focus:outline-none transition-colors font-display text-xl ${formErrors.datetime ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-black'}`}
                />
                {formErrors.datetime && (
                  <p id="datetime-error" className="text-red-500 text-xs mt-2 font-bold uppercase flex items-center gap-1">
                    <AlertCircle size={12} /> {formErrors.datetime}
                  </p>
                )}
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-brand-accent group-focus-within:scale-105 origin-left transition-all duration-300">Special Instructions</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black focus:outline-none transition-colors font-display text-xl resize-none"
                  placeholder="ADD DETAILS HERE"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-brand-accent text-white py-6 font-display font-bold text-xl uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-4 mt-8"
              >
                Confirm Request <MoveRight />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-paper border-t border-black py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h4 className="font-display font-bold text-2xl uppercase mb-2">QuickFix Services</h4>
          <p className="text-sm text-gray-500">© 2024. All rights reserved.</p>
        </div>
        <div className="flex gap-8 text-sm uppercase tracking-wider font-medium">
            <a href="#" className="hover:text-brand-accent">Instagram</a>
            <a href="#" className="hover:text-brand-accent">Facebook</a>
            <a href="#" className="hover:text-brand-accent">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

const ServiceItem = ({ number, title, desc, isLast }: { number: string, title: string, desc: string, isLast?: boolean }) => (
  <div className={`group grid md:grid-cols-12 gap-4 md:gap-12 p-6 md:p-12 border-b border-black hover:bg-white transition-all duration-300 cursor-default ${isLast ? 'border-b' : ''}`}>
    <div className="col-span-1 md:col-span-2 font-display text-4xl text-gray-300 group-hover:text-brand-accent transition-colors">
      {number}
    </div>
    <div className="col-span-1 md:col-span-5">
      <h3 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4 origin-left group-hover:scale-105 transition-transform duration-300">{title}</h3>
    </div>
    <div className="col-span-1 md:col-span-4 flex items-center">
      <p className="text-gray-600 leading-relaxed text-lg max-w-sm group-hover:text-black group-hover:font-medium transition-colors duration-300">{desc}</p>
    </div>
    <div className="col-span-1 md:col-span-1 flex items-center justify-end">
      <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform -rotate-45 group-hover:rotate-0">
        <MoveRight className="group-hover:animate-pulse-scale" />
      </div>
    </div>
  </div>
);

export default App;
