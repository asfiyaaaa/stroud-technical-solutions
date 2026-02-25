import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// ─── Cloudinary Configuration ──────────────────────────────────────
// Called lazily at upload-time so Vercel serverless injects env vars
// before this runs (module-level config is unreliable in serverless).
function configureCloudinary(): string {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            '[CLOUDINARY] Missing env vars: ' +
            'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
        );
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    return cloudName;
}

// ─── Constants ─────────────────────────────────────────────────────
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Validate Resume ───────────────────────────────────────────────
export function validateResume(file: File): string | null {
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted';
    if (file.size > MAX_SIZE) return 'File size must be under 10 MB';
    return null;
}

// ─── Build Download URL ────────────────────────────────────────────
// For resource_type "raw", public_id already contains the file extension
// (e.g. "resumes/filename.pdf"). Do NOT append ".pdf" again.
// fl_attachment forces Content-Disposition: attachment header.
export function buildDownloadUrl(publicId: string, cloudName: string): string {
    const cleanId = publicId.replace(/\.pdf\.pdf$/i, '.pdf'); // defensive double-ext strip
    return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${cleanId}`;
}

// ─── Upload via upload_stream (Promise-wrapped) ────────────────────
// Streams a Buffer directly to Cloudinary — avoids the ~33% base64
// size inflation from data URIs, which can exceed Vercel's body limit.
function uploadBufferToCloudinary(
    buffer: Buffer,
    options: Parameters<typeof cloudinary.uploader.upload_stream>[0]
): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    reject(new Error('[CLOUDINARY] upload_stream returned no result'));
                    return;
                }
                resolve(result);
            }
        );

        // Write the buffer into the stream and signal end-of-data
        stream.end(buffer);
    });
}

// ─── Public: Upload Resume ─────────────────────────────────────────
export async function uploadResume(file: File): Promise<string> {
    // Validate + configure at call-time (never at module load time)
    const cloudName = configureCloudinary();

    console.log('[CLOUDINARY] Starting upload:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

    // Convert Web API File → Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let result: UploadApiResponse;
    try {
        result = await uploadBufferToCloudinary(buffer, {
            resource_type: 'raw',   // required for PDFs and all non-image files
            folder: 'resumes',
            use_filename: true,    // use original filename as public_id base
            unique_filename: true,    // append random suffix to prevent overwrites
        });
    } catch (error) {
        console.error('UPLOAD ERROR', error);
        throw new Error('Failed to upload resume to Cloudinary');
    }

    console.log('[CLOUDINARY] Upload success:', {
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        secure_url: result.secure_url,
    });

    const downloadUrl = buildDownloadUrl(result.public_id, cloudName);
    console.log('[CLOUDINARY] Download URL:', downloadUrl);

    return downloadUrl;
}
