import React, { useState } from "react";
import Link from 'next/link';
import { Calendar, Lock, Unlock, FileText, Bell, UserPlus, Folder, PieChart, Users, Clipboard } from "lucide-react";

const DoctorServices = () => {
  const [isHovered, setIsHovered] = useState(null);

  // Dịch vụ chính
  const mainServices = [
    {
      title: 'Lock Patient Record',
      desc: 'Securely lock patient medical records on the blockchain to ensure only authorized access.',
      alt: 'Lock record',
      link: '/doctor_service/lock',
      icon: <Lock size={40} className="text-white" />,
      color: 'bg-blue-700',
    },
    {
      title: 'Unlock Patient Record',
      desc: 'Safely unlock patient records with blockchain verification for viewing or updating.',
      alt: 'Unlock record',
      link: '/doctor_service/unlock',
      icon: <Unlock size={40} className="text-white" />,
      color: 'bg-emerald-600',
    },
    {
      title: 'Update Patient Record',
      desc: 'Update patient medical history, diagnoses, or treatments with secure blockchain integration.',
      alt: 'Update record',
      link: '/doctor_service/update',
      icon: <FileText size={40} className="text-white" />,
      color: 'bg-indigo-700',
    },
  ];

  // Dịch vụ bổ sung (không có link thực)
  const additionalServices = [
    {
      title: 'Patient Appointments',
      desc: 'Manage your daily schedule and upcoming patient appointments.',
      icon: <Calendar size={26} className="text-gray-700" />,
    },
    {
      title: 'Patient Registration',
      desc: 'Register new patients into the blockchain medical system.',
      icon: <UserPlus size={26} className="text-gray-700" />,
    },
    {
      title: 'Medical Records',
      desc: 'View and manage all patient medical histories.',
      icon: <Folder size={26} className="text-gray-700" />,
    },
    {
      title: 'Analytics Dashboard',
      desc: 'View statistics and reports about your medical practice.',
      icon: <PieChart size={26} className="text-gray-700" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-md">
              <FileText size={24} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">MedChain</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a className="text-gray-600 hover:text-blue-600 font-medium" href="#">Dashboard</a>
            <a className="text-gray-600 hover:text-blue-600 font-medium" href="#">Patients</a>
            <a className="text-blue-600 font-medium border-b-2 border-blue-600" href="#">Services</a>
            <a className="text-gray-600 hover:text-blue-600 font-medium" href="#">Reports</a>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-medium">DR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Doctor Services Portal</h1>
            <p className="text-xl text-blue-100">Access all your medical practice tools securely on blockchain for enhanced patient care and efficient healthcare management</p>
            <div className="mt-8 flex space-x-4">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200">View Dashboard</button>
              <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-200">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[
              { label: "Patient Records", value: "1,259", icon: <Users size={20} className="text-blue-600" /> },
              { label: "Records Secured", value: "987", icon: <Lock size={20} className="text-emerald-600" /> },
              { label: "Monthly Updates", value: "342", icon: <FileText size={20} className="text-indigo-600" /> },
              { label: "Success Rate", value: "99.8%", icon: <Clipboard size={20} className="text-purple-600" /> }
            ].map((stat, index) => (
              <div key={index} className="p-6 flex items-center">
                <div className="mr-4">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Visual */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Blockchain Security</h2>
          
          <div className="bg-gray-50 rounded-xl p-8 shadow-inner mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {[1, 2, 3, "n"].map((block, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md p-4 shadow-md w-32 h-32 flex flex-col items-center justify-center">
                      <div className="text-xs mb-1 opacity-75">HASH #4F2A...</div>
                      <div className="font-bold mb-2">Block #{block}</div>
                      <div className="text-xs bg-blue-800 rounded px-2 py-1">Patient Data</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{block === 1 ? "Genesis" : block === "n" ? "Latest" : ""}</div>
                  </div>
                  {index < 3 && (
                    <div className="text-2xl text-gray-400 px-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-center text-gray-700 max-w-2xl mx-auto">
              <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded-md mb-4">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="font-medium text-blue-800">End-to-End Encryption</span>
                </div>
                <p className="text-sm text-gray-600">Medical records are fully encrypted using advanced cryptographic algorithms</p>
              </div>
              <div className="bg-emerald-100 border-l-4 border-emerald-600 p-4 rounded-md">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="font-medium text-emerald-800">Immutable & Secure Access</span>
                </div>
                <p className="text-sm text-gray-600">Data is tamper-proof and accessible only through secure authentication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Primary Services</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Access essential blockchain-integrated functions for managing patient medical records with the highest level of security and compliance</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Link key={index} href={service.link}>
                <div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className={`${service.color} p-6 flex justify-center`}>
                    <div className="bg-white bg-opacity-20 p-4 rounded-full">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.desc}</p>
                    <div className={`flex items-center text-${service.color.split('-')[1]}-600 font-medium transition-all duration-300 ${isHovered === index ? 'translate-x-2' : ''}`}>
                      <span>Access Service</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Additional Services</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Comprehensive tools to streamline your practice management and enhance patient care</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-md cursor-not-allowed opacity-80">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{service.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Coming Soon</span>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">Preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to enhance your practice?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Join thousands of medical professionals using blockchain technology to secure patient data and streamline healthcare operations</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition duration-200">Contact Support</button>
            <button className="border border-white text-white px-8 py-4 rounded-md font-medium hover:bg-blue-700 transition duration-200">Schedule Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-1 rounded-md">
                  <FileText size={18} className="text-white" />
                </div>
                <span className="font-bold text-white">MedChain</span>
              </div>
              <p className="text-sm">Secure, transparent, and efficient blockchain solutions for healthcare professionals.</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400">Patient Records</a></li>
                <li><a href="#" className="hover:text-blue-400">Security Solutions</a></li>
                <li><a href="#" className="hover:text-blue-400">Analytics</a></li>
                <li><a href="#" className="hover:text-blue-400">Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400">Compliance</a></li>
                <li><a href="#" className="hover:text-blue-400">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>support@medchain.example.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Blockchain Ave, Suite 200</li>
                <li>San Francisco, CA 94103</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 MedChain. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoctorServices;