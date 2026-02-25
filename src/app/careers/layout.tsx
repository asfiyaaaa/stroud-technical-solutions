import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers',
    description: 'Join Stroud Technical Solutions LLC. Explore career opportunities in pharmaceutical engineering, validation, quality, and technical consulting.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
