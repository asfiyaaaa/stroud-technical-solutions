import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Explore our comprehensive pharmaceutical, biotech, and engineering services including automation, validation, quality engineering, metrology, and CAPA management.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
