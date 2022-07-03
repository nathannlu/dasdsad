export const MAX_UPLOAD_LIMIT = 26843545600 // Pinata max upload limit (25gb)
export const IMAGE_MIME_TYPES = ['image/png', 'image/webp', 'video/mp4']	// Mime types for NFT artwork + placeholder img
export const METADATA_MIME_TYPES = ['application/json'] // Mime types for NFT metadata

// nftStorageType: 's3' | 'ipfs'

{/* <user_id>/<contract_id>/revealed/<file_name>
<user_id>/<contract_id>/un-revealed/<file_name></file_name> */}