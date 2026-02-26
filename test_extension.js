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

    // Real-ish PDF buffer
    const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n178\n%%EOF');
    const file = new MockFile(dummyPdf, 'real_test.pdf', 'application/pdf');

    try {
        console.log('Testing explicit IMAGE resource type...');
        // I will mock the internal call to test what happens if I change the code
        const result = await uploadResume(file);
        console.log('Final URL:', result);

        // I want to see if it has .pdf extension
        if (!result.endsWith('.pdf')) {
            console.error('FAIL: URL does not end with .pdf');
        } else {
            console.log('SUCCESS: URL ends with .pdf');
        }
    } catch (err) {
        console.error('Upload failed:', err);
    }
}

test();
