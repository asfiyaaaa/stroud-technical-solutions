'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '@/lib/animations';

const whyStroud = [
    {
        title: 'Specialized Expertise',
        description: 'Our team possesses deep knowledge of the pharmaceutical, life sciences, and biotech industries, delivering precise solutions in validation, calibration, automation, and more to meet your unique challenges.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: 'Tailored Solutions',
        description: "We don't believe in one-size-fits-all. Every project is customized to align with your specific operational goals and regulatory requirements, ensuring optimal outcomes.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
    {
        title: 'Regulatory Compliance',
        description: 'With a thorough understanding of industry standards, we help you navigate complex regulations, ensuring your processes and systems are compliant and audit-ready.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
    {
        title: 'Proven Reliability',
        description: 'Our commitment to quality and attention to detail means you can trust us to deliver consistent, high-impact results that enhance efficiency and performance.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        ),
    },
    {
        title: 'Collaborative Partnership',
        description: 'We work as an extension of your team, fostering open communication and collaboration to drive success and support your mission to advance scientific innovation.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        title: 'Innovative Approach',
        description: 'By leveraging cutting-edge technologies and best practices, we provide forward-thinking solutions that keep you ahead in a rapidly evolving industry.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
    },
];

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Page Title */}
            <section className="pt-36 pb-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight"
                    >
                        About Stroud Technical Solutions
                    </motion.h1>
                </div>
            </section>

            {/* Company Overview — Image Left, Text Right */}
            <section className="pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* DNA Helix Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInLeft}
                            className="relative"
                        >
                            <div className="sticky top-32">
                                <Image
                                    src="/dna-helix.png"
                                    alt="DNA double helix — representing life sciences innovation"
                                    width={600}
                                    height={700}
                                    className="w-full h-auto rounded-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInRight}
                            className="space-y-6 text-slate-700 text-lg leading-relaxed"
                        >
                            <p>
                                At <strong>Stroud Technical Solutions</strong>, we are dedicated to empowering
                                pharmaceutical, life sciences, and biotech companies with innovative and
                                reliable consulting services. With a deep understanding of the complexities
                                in these highly regulated industries, we provide tailored solutions to ensure
                                operational excellence and compliance.
                            </p>
                            <p>
                                Our expertise spans{' '}
                                <strong>validation, calibration, maintenance, automation, cleaning
                                    validation, process validation</strong>, and more, enabling our clients to focus
                                on advancing science and improving lives.
                            </p>
                            <p>
                                Founded on the principles of precision, integrity, and partnership, we
                                work closely with our clients to deliver customized strategies that
                                streamline processes, enhance efficiency, and meet stringent regulatory
                                standards. Our team of seasoned professionals brings extensive industry
                                knowledge and a commitment to excellence, ensuring every project is
                                executed with the highest level of quality and care.
                            </p>
                            <p>
                                Whether you&apos;re optimizing manufacturing processes, ensuring
                                equipment reliability, or navigating complex compliance requirements,
                                Stroud Technical Solutions is your trusted partner. We are driven by a
                                passion for innovation and a mission to support the transformative work
                                of our clients in the pharmaceutical, life sciences, and biotech sectors.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose Stroud? */}
            <section className="py-24 px-4 bg-slate-50 border-t-4 border-blue-600">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                            Why Choose Stroud?
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {whyStroud.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-primary-900">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
                            Ready to Partner With Us?
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                            Let us help you navigate the complexities of regulated industries with
                            confidence and precision.
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-primary-900 font-bold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                        >
                            Get in Touch
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
