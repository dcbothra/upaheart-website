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
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`Failed to get upload URL: ${response.status} ${errorText}`);
        }

        const { uploadUrl, fileUrl } = await response.json();
        console.log("Got upload URL:", uploadUrl);

        // 2. Upload the file directly to S3/Supabase
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });

        if (!uploadResponse.ok) {
            const uploadErrorText = await uploadResponse.text();
            console.error('Storage Upload Error:', uploadErrorText);
            throw new Error(`Failed to upload to storage: ${uploadResponse.status} ${uploadErrorText}`);
        }

        return fileUrl;
    } catch (error) {
        console.error('Upload flow error:', error);
        alert(`Upload Debug Error: ${(error as Error).message}`); // Show error to user for debugging
        throw error;
    }
}
