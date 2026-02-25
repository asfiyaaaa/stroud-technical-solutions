'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '@/lib/animations';

const pharmaServices = [
  {
    title: 'Automation',
    description: 'We provide comprehensive automation solutions that enhance operational efficiency and precision in pharmaceutical manufacturing. Our expertise ensures seamless integration of automated systems, reducing human error while maintaining strict compliance with industry standards.',
    image: '/service-automation.png',
  },
  {
    title: 'Cleaning Validation',
    description: 'Our cleaning validation services ensure that equipment and facilities meet rigorous cleanliness standards required for pharmaceutical production. We develop and execute thorough validation protocols that demonstrate effective removal of residues, preventing cross-contamination and ensuring product safety.',
    image: '/service-cleaning.png',
  },
  {
    title: 'Quality Engineering',
    description: 'We deliver robust quality engineering solutions that strengthen your manufacturing processes and product reliability. Our team implements comprehensive quality systems, statistical process control, and continuous improvement methodologies.',
    image: '/service-quality.png',
  },
  {
    title: 'Process Validation',
    description: 'Our process validation services establish documented evidence that manufacturing processes consistently produce products meeting predetermined specifications and quality attributes, ensuring FDA and GMP compliance at every stage.',
    image: '/service-process.png',
  },
];

const engineeringServices = [
  {
    title: 'Metrology',
    description: 'Precision calibration, instrumentation, and measurement systems to ensure accuracy and traceability across your manufacturing operations. Our metrology services meet the highest standards of pharmaceutical quality.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Manufacturing Engineering',
    description: 'Optimized manufacturing processes for pharma and biotech production facilities. We design and implement scalable engineering solutions that maximize throughput while maintaining regulatory compliance.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Project Management',
    description: 'End-to-end project management services for pharmaceutical engineering initiatives. We ensure timely delivery, budget adherence, and seamless coordination across all stakeholders and regulatory bodies.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Commissioning & Qualification',
    description: 'Comprehensive commissioning and qualification services for pharmaceutical facilities, equipment, and systems. We ensure all installations meet rigorous quality and safety requirements before going live.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
  },
];

const whyChooseUs = [
  {
    title: 'Regulatory Expertise',
    description: 'Deep understanding of FDA, EMA, and global regulatory frameworks ensuring full compliance.',
    icon: '🛡️',
  },
  {
    title: 'Industry Experience',
    description: 'Proven track record across pharmaceutical, biotech, and life sciences sectors.',
    icon: '🏭',
  },
  {
    title: 'Operational Excellence',
    description: 'Data-driven approach to optimize processes, reduce costs, and improve quality.',
    icon: '⚡',
  },
  {
    title: 'Partnership Approach',
    description: 'We integrate with your team, treating your challenges as our own.',
    icon: '🤝',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'pharma' | 'engineering'>('pharma');
  const activeServices = activeTab === 'pharma' ? pharmaServices : engineeringServices;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center overflow-hidden perspective-2000">
        {/* Parallax Background Layer */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center pointer-events-none z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/70 to-blue-100/60 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            style={{ y: textY }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-5xl"
            >
              <motion.h1
                variants={staggerItem}
                className="font-heading text-4xl sm:text-6xl lg:text-8.5xl font-black text-slate-900 leading-tight mb-8 tracking-tighter drop-shadow-sm"
              >
                Stroud <span className="text-[#2563eb]">Technical</span> Solutions
              </motion.h1>

              <motion.p
                variants={staggerItem}
                className="text-lg sm:text-2xl text-slate-600 font-semibold leading-relaxed mb-12 max-w-3xl mx-auto"
              >
                Empowering Pharmaceutical, Life Sciences, and Biotech Excellence <br className="hidden md:block" />
                Through Innovative Consulting Solutions
              </motion.p>

              <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-6">
                <Link href="/services" className="bg-[#2563eb] hover:bg-blue-600 text-white text-lg font-extrabold px-12 py-5 rounded-md shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                  Explore Our Services
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/contact" className="bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50 text-lg font-extrabold px-12 py-5 rounded-md transition-all hover:scale-105 active:scale-95">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Trust Messaging */}
      <section className="bg-steel-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-steel-500 text-sm font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              FDA Compliant
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              cGMP Validated
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Industry Certified
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              ISO Standards
            </span>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={staggerItem} className="font-heading text-4xl sm:text-5xl font-bold text-primary-900">
              Our Services
            </motion.h2>
            <motion.p variants={staggerItem} className="text-steel-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
              Comprehensive consulting solutions tailored to pharmaceutical, life sciences, and biotech industries
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-lg border border-slate-200 p-1 mb-8">
              <button
                onClick={() => setActiveTab('pharma')}
                className={`px-8 py-2.5 text-base font-bold rounded-md transition-all duration-300 ${activeTab === 'pharma'
                  ? 'bg-[#2563eb] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                Pharmaceutical
              </button>
              <button
                onClick={() => setActiveTab('engineering')}
                className={`px-8 py-2.5 text-base font-bold rounded-md transition-all duration-300 ${activeTab === 'engineering'
                  ? 'bg-[#2563eb] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                Engineering
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {activeServices.map((service, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
                variants={staggerItem}
                className="card-3d-wrapper group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col items-center preserve-3d"
              >
                <div className="h-64 w-full overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-500" />
                </div>
                <div className="p-10 flex flex-col items-center text-center translate-z-20">
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 mb-4 group-hover:text-[#2563eb] transition-colors translate-z-30">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium translate-z-10">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#2563eb] font-semibold hover:text-blue-700 transition-colors"
            >
              View All Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        {/* Floating Background Icons */}
        <div className="absolute top-20 left-10 text-blue-200 opacity-20 animate-float pointer-events-none hidden lg:block">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" /></svg>
        </div>
        <div className="absolute bottom-20 right-10 text-purple-200 opacity-20 animate-float-delayed pointer-events-none hidden lg:block">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2v10.17c.7-.21 1.45-.3 2.22-.17a4.99 4.99 0 014.28 4.29c.13.77.04 1.52-.17 2.22H22l-1.5-1.5V11l-4-4V2h-3.5z" /></svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <span className="text-[#2563eb] font-black text-sm uppercase tracking-[0.2em]">
                Excellence Redefined
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 mt-4 mb-8 leading-tight tracking-tighter">
                Why Stroud Technical <br />
                <span className="text-[#2563eb]">Solutions?</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium opacity-80">
                We combine industry-leading technical expertise with a commitment to regulatory excellence. Our solutions are designed to scale with your organization&apos;s growth while maintaining operational integrity.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {whyChooseUs.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
                  >
                    <div className="text-4xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{item.icon}</div>
                    <h3 className="font-heading font-black text-xl text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="relative perspective-2000 hidden lg:block"
            >
              <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] rotate-y-10 hover:rotate-y-0 transition-all duration-1000 preserve-3d group">
                <img
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200"
                  alt="Quality Excellence"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2563eb]/60 via-transparent to-purple-600/20 mix-blend-overlay pointer-events-none" />

                {/* 3D Floating Content over Image */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute bottom-12 left-10 right-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2rem] translate-z-30 shadow-2xl"
                >
                  <p className="text-white font-black text-4xl mb-2 tracking-tighter">15+ Years</p>
                  <p className="text-white/80 font-bold text-lg">Engineering Excellence in Pharmaceutical Innovation.</p>
                </motion.div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Parallax-like layer */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-fixed bg-center opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-900/95 to-purple-900/95 pointer-events-none" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col items-center"
          >
            <h2 className="font-heading text-5xl sm:text-6xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl">
              Ready to <span className="text-blue-400">Elevate</span> Your Operations?
            </h2>
            <p className="text-white/90 text-xl sm:text-2xl mb-12 max-w-3xl font-medium leading-relaxed drop-shadow-lg">
              Partner with Stroud Technical Solutions for engineering excellence,
              regulatory compliance, and operational integrity.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/contact" className="bg-[#2563eb] hover:bg-blue-600 text-white text-xl font-black px-12 py-5 rounded-md shadow-[0_20px_60px_rgba(37,99,235,0.5)] transition-all hover:scale-110 active:scale-95 flex items-center gap-3">
                Get Started Today
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/about" className="bg-white/10 hover:bg-white/20 text-white text-xl font-black px-12 py-5 rounded-md backdrop-blur-md border border-white/30 shadow-2xl transition-all hover:scale-110 active:scale-95">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
