export default function JsonLd() {
    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Stroud Technical Solutions LLC',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stroudtechnicalsolutions.com',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stroudtechnicalsolutions.com'}/logo.png`,
        description:
            'Engineering and technical consulting services for pharmaceutical, life sciences, and biotech industries.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '138 Cotten Drive',
            addressLocality: 'Morrisville',
            addressRegion: 'NC',
            postalCode: '27560',
            addressCountry: 'US',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-919-800-7677',
            contactType: 'customer service',
            email: 'info@stroudtechnicalsolutions.com',
        },
        sameAs: [],
        areaServed: 'US',
        knowsAbout: [
            'Pharmaceutical Manufacturing',
            'Process Validation',
            'Cleaning Validation',
            'Automation Engineering',
            'Quality Engineering',
            'Metrology',
            'Biotech',
            'Life Sciences',
            'cGMP Compliance',
            'FDA Regulations',
        ],
    };

    const localBusinessData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Stroud Technical Solutions LLC',
        image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stroudtechnicalsolutions.com'}/og-image.jpg`,
        telephone: '+1-919-800-7677',
        email: 'info@stroudtechnicalsolutions.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '138 Cotten Drive',
            addressLocality: 'Morrisville',
            addressRegion: 'NC',
            postalCode: '27560',
            addressCountry: 'US',
        },
        priceRange: '$$$$',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
            />
        </>
    );
}
