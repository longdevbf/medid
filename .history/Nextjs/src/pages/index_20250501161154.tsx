import React from 'react';
import { Database, Lock, CreditCard, Pill } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/50 to-black/70 z-0">
        <img 
          src="http://benhvienhuyencuchi.com/wp-content/uploads/2018/05/banner3_bvcc.jpg" 
          alt="Medical professional background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-8 relative z-10 flex items-center min-h-[70vh]">
        <div className="max-w-xl text-left">
          {/* Heading with gradient */}
          <h1 className="text-5xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-100 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
              Empowering Healthcare
              <br />
              With Secure Digital
              <br />
              Records
            </span>
          </h1>
          
          {/* Subheading with improved visibility */}
          <p className="text-xl text-cyan-50 mb-8 font-medium leading-relaxed drop-shadow-md">
            Modern healthcare meets technology.
            <br />
            Manage, share, and protect your medical data with confidence.
            <br />
            Blockchain ensures privacy, transparency, and accessibility for every patient and provider.
          </p>
          
          {/* Buttons with refined styling */}
          <div className="flex flex-wrap gap-5">
            <button className="px-8 py-4 bg-gradient-to-r from-white to-cyan-100 text-blue-800 font-bold rounded-lg shadow-lg hover:shadow-cyan-300/50 transition transform hover:-translate-y-1">
              Book a Consultation
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-white font-bold rounded-lg hover:bg-cyan-500/20 transition transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-400/30">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;