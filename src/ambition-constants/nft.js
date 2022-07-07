export const MAX_UPLOAD_LIMIT = 26843545600 // Pinata max upload limit (25gb)
export const IMAGE_MIME_TYPES = ['image/png', 'image/webp', 'video/mp4']	// Mime types for NFT artwork + placeholder img
export const METADATA_MIME_TYPES = ['application/json'] // Mime types for NFT metadata

/**
 * Mime type to file extension
 */
export const resolveFileExtension = (mimeType) =>
    (mimeType === 'image/webp' && 'webp') ||
    (mimeType === 'video/mp4' && 'mp4') ||
    'png';

// type nftStorageType: 's3' | 'ipfs';
export const getNftStorageTypeLabel = (type) => type === 's3' ? 'Ambition S3 Server' : 'IPFS';