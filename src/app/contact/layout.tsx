import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Contact Stroud Technical Solutions LLC for pharmaceutical engineering and technical consulting services. Phone: 919-800-7677. Located in Morrisville, NC.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
