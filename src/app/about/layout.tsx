import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Stroud Technical Solutions LLC — our mission, core values, and commitment to engineering excellence in pharmaceutical and life sciences consulting.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
