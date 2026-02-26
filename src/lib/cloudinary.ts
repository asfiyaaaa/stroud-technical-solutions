/**
 * cloudinary.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudinary upload utility for Next.js / Vercel serverless.
 *
 * Design decisions:
 *  • Configures Cloudinary lazily inside functions — NOT at module scope.
 *    Module-scope config.() is unreliable on Vercel because env vars may not
 *    be injected yet when the module is first evaluated.
 *  • Streams a Buffer directly via upload_stream — avoids ~33% base64 bloat
 *    from data URIs, which can breach Vercel's 4.5 MB request-body limit.
 *  • Wraps upload_stream in a Promise for clean async/await usage.
 *  • Accepts upload options as `Record<string, unknown>` so this file compiles
 *    correctly regardless of which Cloudinary typedef version is installed on
 *    the build host (Vercel's typedefs differ from local ones).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Minimal type that satisfies every Cloudinary upload options shape. */
type CloudinaryUploadOptions = Record<string, unknown>;

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─── Lazy configuration ──────────────────────────────────────────────────────

/**
 * Reads env vars and applies them to the Cloudinary SDK at call-time.
 * Returns the cloud name so callers can build download URLs.
 * Throws with a clear message if any credential is missing.
 */
function configureCloudinary(): string {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            '[CLOUDINARY] Missing required environment variables. ' +
            'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET ' +
            'in your Vercel project settings (Settings → Environment Variables).'
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

// ─── Validate resume ─────────────────────────────────────────────────────────

/**
 * Validates a resume file before upload.
 * Returns an error string on failure, or null on success.
 */
export function validateResume(file: File): string | null {
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (file.size > MAX_SIZE_BYTES) return 'File must be under 10 MB.';
    return null;
}

// ─── Build download URL ──────────────────────────────────────────────────────

/**
 * Builds a stable Cloudinary download URL for a raw (non-image) asset.
 *
 * For resource_type "raw", Cloudinary embeds the file extension in public_id
 * (e.g. "resumes/CV.pdf"). The URL pattern is deliberately:
 *   https://res.cloudinary.com/<cloud>/raw/upload/<transformations>/<public_id>
 *
 * fl_attachment forces Content-Disposition: attachment so browsers download
 * the file instead of attempting to render it inline.
 */
export function buildDownloadUrl(publicId: string, cloudName: string): string {
    // Defensive guard against accidental double extension (e.g. "file.pdf.pdf")
    const safeId = publicId.replace(/\.pdf\.pdf$/i, '.pdf');
    return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${safeId}`;
}

// ─── Core upload helper ───────────────────────────────────────────────────────

/**
 * Uploads a Node.js Buffer to Cloudinary via upload_stream.
 *
 * Options are typed as `Record<string, unknown>` because the Cloudinary SDK's
 * TypeScript definitions for the first argument of upload_stream vary between
 * package versions — some builds resolve it as `UploadResponseCallback` (the
 * callback type) rather than the options object, causing false TypeScript errors
 * for known valid properties like `resource_type`.
 *
 * Using our own loose-but-honest type here avoids that inconsistency without
 * resorting to `any` in consumer code.
 */
function uploadBufferToCloudinary(
    buffer: Buffer,
    options: CloudinaryUploadOptions,
): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options as any,   // cast needed only at the SDK boundary
            (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined,
            ) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    reject(new Error('[CLOUDINARY] upload_stream returned no result'));
                    return;
                }
                resolve(result);
            },
        );

        stream.end(buffer);
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Uploads a PDF resume File to Cloudinary and returns a download URL.
 *
 * Flow:
 *   1. Configure Cloudinary from env vars (lazy, call-time).
 *   2. Convert Web API File → Node.js Buffer.
 *   3. Upload Buffer via upload_stream with resource_type "raw".
 *   4. Build and return a stable fl_attachment download URL.
 *
 * Throws on upload failure so the caller (API route) can handle the error
 * and return an appropriate HTTP response.
 */
export async function uploadResume(file: File): Promise<string> {
    // ── 1. Configure ──────────────────────────────────────────────────────────
    const cloudName = configureCloudinary();

    console.log('[CLOUDINARY] Starting upload:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

    // ── 2. Convert File → Buffer ──────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── 3. Upload ─────────────────────────────────────────────────────────────
    let result: UploadApiResponse;
    try {
        result = await uploadBufferToCloudinary(buffer, {
            resource_type: 'raw',  // REQUIRED for PDFs and all non-image files
            folder: 'resumes',
            use_filename: true,   // use original filename as public_id base
            unique_filename: true,   // append random suffix to prevent collisions
        });
    } catch (err: unknown) {
        // Log the full error object so Vercel Function Logs show the real reason
        // (e.g. "Invalid Signature" → wrong API secret, "401" → bad credentials)
        console.error('[CLOUDINARY] Upload error (full):', err);

        const message =
            err instanceof Error
                ? err.message
                : typeof err === 'object' && err !== null
                    ? JSON.stringify(err)
                    : String(err);

        console.error('[CLOUDINARY] Upload error (message):', message);

        // Re-throw so the API route can surface it to the client
        throw new Error(`Cloudinary upload failed: ${message}`);
    }

    // ── 4. Build download URL ─────────────────────────────────────────────────
    console.log('[CLOUDINARY] Upload succeeded:', {
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        secure_url: result.secure_url,
    });

    const downloadUrl = buildDownloadUrl(result.public_id, cloudName);
    console.log('[CLOUDINARY] Download URL:', downloadUrl);

    return downloadUrl;
}
