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

    const dummyPdf = Buffer.from('%PDF-1.4\n%...');
    const file = new MockFile(dummyPdf, 'test.pdf', 'application/pdf');

    try {
        console.log('Uploading...');
        const secureUrl = await uploadResume(file);
        console.log('Secure URL:', secureUrl);

        const urls = buildResumeUrls(secureUrl);
        console.log('Final URLs:', JSON.stringify(urls, null, 2));

        if (urls.viewUrl.includes('fl_inline')) {
            console.error('FAIL: viewUrl still contains fl_inline!');
        } else {
            console.log('SUCCESS: No fl_inline found in URLs.');
        }
    } catch (err) {
        console.error('Upload failed:', err);
    }
}

test();
