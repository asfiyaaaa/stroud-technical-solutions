import { v2 as cloudinary } from 'cloudinary';

// ─── Cloudinary Configuration ─────────────────────────────────────
// Called lazily at upload-time so Vercel serverless env vars are
// guaranteed to be injected before this runs.
function configureCloudinary() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            '[CLOUDINARY] Missing required env vars: ' +
            'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });

    return cloudName;
}

// ─── Constants ────────────────────────────────────────────────────
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Validate Resume ──────────────────────────────────────────────
export function validateResume(file: File): string | null {
    if (file.type !== 'application/pdf') {
        return 'Only PDF files are accepted';
    }
    if (file.size > MAX_SIZE) {
        return 'File size must be under 10 MB';
    }
    return null;
}

// ─── Build Download URL ───────────────────────────────────────────
// For resource_type "raw", Cloudinary's public_id already includes the
// file extension (e.g. "resumes/filename.pdf"). We use fl_attachment so
// the browser receives the correct Content-Disposition: attachment header.
//
// Final URL shape:
//   https://res.cloudinary.com/<cloud>/raw/upload/fl_attachment/<public_id>
//
// NOTE: Do NOT append ".pdf" — the public_id for raw uploads already ends
// in ".pdf". Appending it again produces a double extension and 404s.
export function buildDownloadUrl(publicId: string, cloudName: string): string {
    // Strip any double extension just in case (defensive)
    const cleanId = publicId.replace(/\.pdf\.pdf$/i, '.pdf');
    return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${cleanId}`;
}

// ─── Upload Resume ────────────────────────────────────────────────
export async function uploadResume(file: File): Promise<string> {
    // Configure + validate env vars at call-time (not module load time)
    const cloudName = configureCloudinary();

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    console.log(
        '[CLOUDINARY] Starting upload:',
        file.name,
        `(${(file.size / 1024).toFixed(1)} KB)`
    );

    let result: Awaited<ReturnType<typeof cloudinary.uploader.upload>>;
    try {
        result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'raw',      // ← required for non-image files (PDFs)
            folder: 'resumes',
            use_filename: true,        // ← use original filename as public_id base
            unique_filename: true,     // ← add random suffix to avoid collisions
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

    // Build the proper download URL with fl_attachment
    const downloadUrl = buildDownloadUrl(result.public_id, cloudName);
    console.log('[CLOUDINARY] Download URL:', downloadUrl);

    return downloadUrl;
}
