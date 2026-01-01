import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize with Service Role Key for Admin access (to generate upload tokens)
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, filetype } = req.body;

        if (!filename || !filetype) {
            return res.status(400).json({ error: 'Missing filename or filetype' });
        }

        // Sanitize filename
        const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '');
        const uniquePath = `uploads/${Date.now()}-${cleanName}`;
        const bucketName = 'upaheart-pictures'; // User confirmed bucket name

        // Generate a secure Signed Upload URL
        // This allows the frontend to upload directly to this path
        const { data, error } = await supabase
            .storage
            .from(bucketName)
            .createSignedUploadUrl(uniquePath);

        if (error) {
            throw error;
        }

        // data.signedUrl is the URL the frontend will PUT the file to
        // The public URL is constructed manually for public buckets
        const { data: publicData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(uniquePath);

        return res.status(200).json({
            uploadUrl: data?.signedUrl,
            fileUrl: publicData.publicUrl
        });

    } catch (error: any) {
        console.error('Supabase Storage Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
