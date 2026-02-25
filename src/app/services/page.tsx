'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

interface Service {
    id: string;
    title: string;
    description: string;
    details: string[];
    compliance: string[];
    useCases: string[];
}

const pharmaServices: Service[] = [
    {
        id: 'automation',
        title: 'Automation',
        description: 'Design, implement, and validate advanced automation systems for pharmaceutical manufacturing, ensuring precision, efficiency, and regulatory compliance.',
        details: [
            'PLC/DCS programming and system integration',
            'SCADA system design and implementation',
            'Batch process automation',
            'Equipment qualification (IQ/OQ/PQ)',
            'Control system validation (CSV)',
            '21 CFR Part 11 compliance assessments',
        ],
        compliance: ['21 CFR Part 11', 'GAMP 5', 'ISA-88', 'ISA-95'],
        useCases: ['Bioreactor automation', 'Fill-finish line control', 'Clean-in-Place (CIP) systems', 'Packaging line integration'],
    },
    {
        id: 'cleaning-validation',
        title: 'Cleaning Validation',
        description: 'Develop and execute comprehensive cleaning validation programs that ensure product safety, prevent cross-contamination, and meet regulatory expectations.',
        details: [
            'Cleaning validation protocol development',
            'Swab and rinse sampling methodology',
            'Analytical method development and validation',
            'Residue limit calculations (MACO, PDE/ADE)',
            'Worst-case product grouping and matrix approaches',
            'Cleaning verification programs',
        ],
        compliance: ['FDA Cleaning Validation Guidance', 'EU GMP Annex 15', 'PIC/S PI 006-3', 'EMA Shared Facilities Guideline'],
        useCases: ['Multi-product facility cleaning', 'Dedicated equipment cleaning', 'High-potency compound handling', 'Biologics manufacturing'],
    },
    {
        id: 'quality-engineering',
        title: 'Quality Engineering',
        description: 'Build and maintain robust quality systems that ensure compliance, drive continuous improvement, and support regulatory submissions.',
        details: [
            'Quality Management System (QMS) development',
            'Standard Operating Procedure (SOP) creation',
            'Quality risk management (ICH Q9)',
            'Change control and deviation management',
            'Supplier qualification and auditing',
            'Regulatory inspection readiness',
        ],
        compliance: ['ICH Q9', 'ICH Q10', '21 CFR Part 210/211', 'ISO 13485'],
        useCases: ['New facility startup quality systems', 'Post-acquisition integration', 'Pre-approval inspection preparation', 'Continuous improvement programs'],
    },
    {
        id: 'process-validation',
        title: 'Process Validation',
        description: 'Execute end-to-end process validation aligned with FDA and global regulatory requirements, from process design through continued process verification.',
        details: [
            'Process Performance Qualification (PPQ)',
            'Continued Process Verification (CPV)',
            'Statistical process analysis',
            'Critical Process Parameter (CPP) identification',
            'Critical Quality Attribute (CQA) monitoring',
            'Process validation lifecycle management',
        ],
        compliance: ['FDA Process Validation Guidance (2011)', 'EU GMP Annex 15', 'ICH Q8/Q9/Q10', 'PDA TR-60'],
        useCases: ['New product launch validation', 'Process transfer and scale-up', 'Legacy product revalidation', 'Continuous manufacturing validation'],
    },
];

const engineeringServices: Service[] = [
    {
        id: 'metrology',
        title: 'Metrology & Instrumentation',
        description: 'Comprehensive calibration, instrumentation, and measurement system services ensuring accuracy and traceability in pharmaceutical manufacturing.',
        details: [
            'Calibration program management',
            'Instrument loop testing and tuning',
            'Temperature mapping and qualification',
            'Measurement System Analysis (MSA)',
            'Instrument specification and selection',
            'Environmental monitoring system qualification',
        ],
        compliance: ['ISO 17025', '21 CFR Part 211.68', 'EU GMP Annex 11', 'USP <1058>'],
        useCases: ['Warehouse temperature mapping', 'Autoclave qualification', 'Cleanroom monitoring systems', 'Laboratory instrument qualification'],
    },
    {
        id: 'maintenance-engineering',
        title: 'Maintenance Engineering',
        description: 'Develop and optimize preventive and predictive maintenance programs that maximize equipment uptime, ensure compliance, and reduce costs.',
        details: [
            'Preventive maintenance program development',
            'Predictive maintenance strategy implementation',
            'Equipment reliability analysis',
            'Spare parts optimization',
            'Computerized Maintenance Management System (CMMS) implementation',
            'Maintenance training and competency assessment',
        ],
        compliance: ['FDA Equipment Maintenance Requirements', 'EU GMP Chapter 3', 'ISO 55000', 'ISPE Baseline Guides'],
        useCases: ['Facility maintenance optimization', 'Equipment lifecycle management', 'Critical utility maintenance', 'Shutdown/turnaround planning'],
    },
    {
        id: 'manufacturing',
        title: 'Manufacturing Engineering',
        description: 'Optimize pharmaceutical and biotech manufacturing operations through process engineering, technology transfer, and continuous improvement initiatives.',
        details: [
            'Process engineering and optimization',
            'Technology transfer management',
            'Equipment and facility design review',
            'Capacity planning and utilization analysis',
            'Lean manufacturing implementation',
            'OEE improvement programs',
        ],
        compliance: ['ICH Q8', 'ISPE Baseline Guides', 'FDA Process Analytical Technology (PAT)', 'EU GMP Quality Risk Management'],
        useCases: ['New facility commissioning', 'Product technology transfer', 'Manufacturing efficiency improvement', 'Capacity expansion projects'],
    },
    {
        id: 'investigations',
        title: 'Investigations & CAPA',
        description: 'Expert investigation services and CAPA management to identify root causes, implement effective corrective actions, and prevent recurrence.',
        details: [
            'Root cause analysis (RCA)',
            'Failure investigation and trending',
            'CAPA development and effectiveness tracking',
            'Out-of-specification (OOS) investigations',
            'Complaint investigation management',
            'Regulatory observation response',
        ],
        compliance: ['21 CFR Part 211.192', 'ICH Q10', 'FDA Warning Letter Trends', 'EU GMP Chapter 1'],
        useCases: ['FDA 483 observation responses', 'Manufacturing deviation investigations', 'Laboratory OOS investigations', 'Product complaint investigations'],
    },
];

function ServiceCard({ service }: { service: Service }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            variants={staggerItem}
            id={service.id}
            className="card-3d-wrapper group border border-slate-100 bg-white rounded-3xl overflow-hidden hover:border-[#2563eb]/30 transition-all duration-500 hover:shadow-2xl preserve-3d"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-8 sm:p-10 text-left flex items-center justify-between gap-6 group relative z-10"
                aria-expanded={isExpanded}
                id={`service-toggle-${service.id}`}
            >
                <div className="translate-z-20">
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 group-hover:text-[#2563eb] transition-colors tracking-tight">
                        {service.title}
                    </h3>
                    <p className="text-slate-500 mt-4 text-base sm:text-lg leading-relaxed font-medium opacity-80">
                        {service.description}
                    </p>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300 translate-z-30"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-steel-100">
                            <div className="grid md:grid-cols-3 gap-6 mt-4">
                                {/* Details */}
                                <div>
                                    <h4 className="font-heading font-semibold text-primary-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Capabilities
                                    </h4>
                                    <ul className="space-y-2">
                                        {service.details.map((detail, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-steel-600">
                                                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Compliance */}
                                <div>
                                    <h4 className="font-heading font-semibold text-primary-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Regulatory Standards
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {service.compliance.map((item, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Use Cases */}
                                <div>
                                    <h4 className="font-heading font-semibold text-primary-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Industry Applications
                                    </h4>
                                    <ul className="space-y-2">
                                        {service.useCases.map((useCase, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-steel-600">
                                                <span className="text-accent mt-0.5">→</span>
                                                {useCase}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-steel-100">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:text-accent-dark transition-colors"
                                >
                                    Discuss This Service
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function ServicesPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden perspective-2000">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 pointer-events-none grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/80 to-blue-100/70" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        style={{ y: textY }}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <span className="text-[#2563eb] font-black text-sm uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100">Technical Solutions</span>
                        <h1 className="font-heading text-5xl sm:text-7xl lg:text-8.5xl font-black text-slate-900 mt-10 mb-8 tracking-tighter leading-[0.9]">
                            Our <br />
                            <span className="text-[#2563eb]">Expertise</span>
                        </h1>
                        <p className="text-slate-600 text-xl sm:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                            Comprehensive engineering and specialized consulting architected
                            for the global pharmaceutical and life sciences manufacturing sectors.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pharmaceutical Services */}
            <section className="section-padding bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner border border-blue-100">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h2 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                                Pharmaceutical Services
                            </h2>
                        </div>
                        <p className="text-slate-600 text-xl font-medium ml-0 sm:ml-22 border-l-4 border-blue-600/20 pl-8 py-2 opacity-80 max-w-3xl">
                            Specialized services ensuring regulatory integrity, safety, and operational excellence across the pharmaceutical production lifecycle.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        {pharmaServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </motion.div>
                </div>

                {/* Visual Background */}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-[0.03] pointer-events-none" />
            </section>

            {/* Engineering Services */}
            <section className="section-padding bg-steel-50 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shadow-inner">
                                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
                                Engineering Services
                            </h2>
                        </div>
                        <p className="text-steel-600 text-lg ml-0 sm:ml-16 border-l-2 border-accent/20 pl-6 py-1">
                            Multi-disciplinary engineering support for instrumentation, manufacturing systems, and facility performance optimization.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                        className="space-y-4"
                    >
                        {engineeringServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-slate-900 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="font-heading text-5xl sm:text-6xl font-black text-white mb-8 tracking-tighter">
                            Need a <span className="text-blue-400">Customized</span> Solution?
                        </h2>
                        <p className="text-white/70 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                            Every project is unique. Let&apos;s discuss how our specialized services can address your specific industry challenges.
                        </p>
                        <Link href="/contact" className="bg-[#2563eb] hover:bg-blue-600 text-white text-xl font-black px-12 py-5 rounded-md shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-110 active:scale-95 inline-flex items-center gap-3">
                            Schedule a Consultation
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
                {/* Background pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full opacity-10 animate-pulse-slow" />
            </section>
        </div>
    );
}
