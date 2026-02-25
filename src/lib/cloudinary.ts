import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Cloudinary auto-configures from CLOUDINARY_URL env var
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config({
    secure: true,
});

const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function validateResume(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Only PDF, DOC, and DOCX files are accepted';
    }
    if (file.size > MAX_SIZE) {
        return 'File size must be under 5MB';
    }
    return null;
}

export interface ResumeUploadResult {
    previewUrl: string;
    downloadUrl: string;
}

export async function uploadResume(file: File): Promise<ResumeUploadResult> {
    const buffer = Buffer.from(await file.arrayBuffer());

    // If Cloudinary is configured, upload to cloud
    if (process.env.CLOUDINARY_URL) {
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Determine format from MIME type to preserve file integrity
        const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';

        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'raw',
            folder: 'resumes',
            use_filename: true,
            unique_filename: true,
            format: ext,
        });

        // fl_inline: serves with Content-Disposition: inline (opens in browser)
        const previewUrl = result.secure_url.replace('/upload/', '/upload/fl_inline/');
        // fl_attachment: serves with Content-Disposition: attachment (forces download, preserves integrity)
        const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');

        return { previewUrl, downloadUrl };
    }

    // Fallback: save to local filesystem (for local development only)
    const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
    await mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const localUrl = `/uploads/resumes/${filename}`;
    return { previewUrl: localUrl, downloadUrl: localUrl };
}
