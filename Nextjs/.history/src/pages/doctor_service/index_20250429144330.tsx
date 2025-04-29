"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ShieldCheck, FileEdit, ChevronRight, Lock, Unlock, RefreshCw } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import 
interface ServiceProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
}

const ServiceCard: React.FC<ServiceProps> = ({ title, description, icon, link }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link href={link}>
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="rounded-full bg-teal-50 p-3 w-14 h-14 flex items-center justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600 flex-grow mb-4">{description}</p>
            <div className="flex items-center text-teal-600 font-medium">
              <span>Access Service</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

const DoctorServices: React.FC = () => {
  const services = [
    {
      title: "Lock Patient Record",
      description: "Securely lock patient medical records on the blockchain to ensure only authorized access.",
      icon: <Lock className="h-7 w-7 text-teal-600" />,
      link: "/doctor_service/lock",
    },
    {
      title: "Unlock Patient Record",
      description: "Safely unlock patient records with blockchain verification for viewing or updating.",
      icon: <Unlock className="h-7 w-7 text-teal-600" />,
      link: "/doctor_service/unlock",
    },
    {
      title: "Update Patient Record",
      description: "Update patient medical history, diagnoses, or treatments with secure blockchain integration.",
      icon: <RefreshCw className="h-7 w-7 text-teal-600" />,
      link: "../doctor_service/update",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-500 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-repeat opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Doctor Services Portal</h1>
            <p className="text-xl text-teal-50 mb-8">
              Access all your medical practice tools securely on blockchain for enhanced patient care and efficient
              healthcare management
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-teal-700">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
              <p className="text-slate-600">Secure Blockchain Storage</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
              <p className="text-slate-600">Access to Patient Records</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl font-bold text-teal-600 mb-2">HIPAA</div>
              <p className="text-slate-600">Compliant System</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Visual */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Blockchain-Powered Security</h2>
          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((block) => (
                <React.Fragment key={block}>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-lg border border-slate-200 px-6 py-4 flex flex-col items-center">
                      <div className="text-sm font-medium text-slate-500">Block #{block}</div>
                      <div className="mt-1 text-xs text-slate-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Encrypted</span>
                      </div>
                    </div>
                  </div>
                  {block < 5 && (
                    <div className="text-teal-500">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="rounded-full bg-teal-50 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-1">End-to-End Encryption</h3>
                <p className="text-sm text-slate-500">All medical records are fully encrypted</p>
              </div>
              <div className="p-4">
                <div className="rounded-full bg-teal-50 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <FileEdit className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-1">Immutable Records</h3>
                <p className="text-sm text-slate-500">Tamper-proof medical history</p>
              </div>
              <div className="p-4">
                <div className="rounded-full bg-teal-50 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-1">Authorized Access</h3>
                <p className="text-sm text-slate-500">Controlled by smart contracts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Doctor Services</h2>
            <p className="text-slate-600">
              Access our comprehensive suite of blockchain-powered tools designed specifically for healthcare
              professionals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to enhance your medical practice?</h2>
            <p className="text-teal-50 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using our blockchain-powered platform to improve patient care
              and security.
            </p>
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DoctorServices
