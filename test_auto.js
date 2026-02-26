const { uploadResume, buildResumeUrls } = require('./src/lib/cloudinary');
const fs = require('fs');
const path = require('path');

// Mock File object for Node
class MockFile {
    constructor(buffer, name, type) {
        this.buffer = buffer;
        this.name = name;
        this.type = type;
        this.size = buffer.length;
    }
    async arrayBuffer() {
        return this.buffer;
    }
}

async function test() {
    process.env.CLOUDINARY_CLOUD_NAME = 'dxbxsfqbs';
    process.env.CLOUDINARY_API_KEY = '456648962359864';
    process.env.CLOUDINARY_API_SECRET = 'Be9_FoPsl6bjanEd1ukZrHdDJNQ';

    const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n178\n%%EOF');
    const file = new MockFile(dummyPdf, 'test_auto.pdf', 'application/pdf');

    try {
        console.log('Uploading with resource_type: auto...');
        const secureUrl = await uploadResume(file);
        console.log('Secure URL:', secureUrl);

        const urls = buildResumeUrls(secureUrl);
        console.log('Final URLs:', JSON.stringify(urls, null, 2));

        console.log('\n--- VERIFICATION INSTRUCTIONS ---');
        console.log('1. Open the Secure URL in your browser.');
        console.log('2. Check the Network tab in DevTools.');
        console.log('3. Ensure Content-Type is "application/pdf".');
        console.log('4. Ensure the PDF renders correctly (not as binary text).');
    } catch (err) {
        console.error('Upload failed:', err);
    }
}

test();
