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

/** Return type for resume upload — provides both view-inline and download URLs. */
export interface ResumeUrls {
    /** Opens the PDF inline in the browser. */
    viewUrl: string;
    /** Forces the browser to download the file. */
    downloadUrl: string;
}

/**
 * Builds both a browser-viewable URL and a download URL.
 *
 * Requirements:
 * 1. viewUrl      — opens in browser PDF viewer
 * 2. downloadUrl  — forces download via ?dl=1
 */
export function buildResumeUrls(secureUrl: string): ResumeUrls {
    return {
        viewUrl: secureUrl,                 // opens in browser
        downloadUrl: `${secureUrl}?dl=1`,   // forces download
    };
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
 * Uploads a PDF resume File to Cloudinary and returns its secure_url.
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
            resource_type: 'image',    // Forced for PDFs to enable document features
            format: 'pdf',             // Guarantee .pdf extension and headers
            folder: 'resumes',
            use_filename: true,
            unique_filename: true,
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

    // ── 4. Return result ──────────────────────────────────────────────────────
    console.log('[CLOUDINARY] Upload succeeded:', {
        public_id: result.public_id,
        resource_type: result.resource_type,
        bytes: result.bytes,
        secure_url: result.secure_url,
    });

    return result.secure_url;
}
