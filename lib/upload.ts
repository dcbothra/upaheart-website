export async function uploadToS3(file: File) {
    try {
        // 1. Get the Presigned URL
        const response = await fetch('/api/upload-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: file.name,
                filetype: file.type,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get upload URL');
        }

        const { uploadUrl, fileUrl } = await response.json();

        // 2. Upload the file directly to S3
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });

        if (!uploadResponse.ok) {
            console.error('S3 Upload Error:', await uploadResponse.text());
            throw new Error('Failed to upload file to storage');
        }

        return fileUrl;
    } catch (error) {
        console.error('Upload flow error:', error);
        throw error;
    }
}
