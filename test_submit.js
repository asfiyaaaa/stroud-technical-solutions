const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testSubmission() {
    const form = new FormData();
    form.append('name', 'Antigravity Test');
    form.append('email', 'test@example.com');
    form.append('resume', fs.createReadStream(path.join(__dirname, 'test.pdf')), 'test.pdf');

    try {
        const response = await axios.post('http://localhost:3000/api/careers', form, {
            headers: form.getHeaders(),
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Create a dummy PDF first
fs.writeFileSync('test.pdf', '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n178\n%%EOF');

testSubmission();
