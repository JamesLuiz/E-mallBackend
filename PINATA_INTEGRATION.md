# Pinata IPFS Integration Documentation

## Overview

This project now uses Pinata for decentralized file storage on IPFS (InterPlanetary File System). All images and documents (profile pictures, KYC documents, product images, vendor logos/banners) are uploaded to Pinata and their URIs are stored in MongoDB.

## Features

- ✅ **Profile Pictures**: User avatar uploads with automatic resizing
- ✅ **Product Images**: Multiple product images with primary image selection
- ✅ **KYC Documents**: Identity documents and proof of address for users and vendors
- ✅ **Vendor Assets**: Logo and banner uploads for vendor stores
- ✅ **File Validation**: Type and size validation based on file category
- ✅ **Metadata Storage**: IPFS hashes stored for potential file deletion
- ✅ **Legacy Compatibility**: Maintains backward compatibility with existing URLs

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Pinata Configuration (IPFS Storage)
PINATA_JWT=your-pinata-jwt-token-here
PINATA_API_KEY=your-pinata-api-key-here
PINATA_SECRET_KEY=your-pinata-secret-key-here
```

### 2. Get Pinata Credentials

1. Sign up at [Pinata.cloud](https://pinata.cloud/)
2. Go to API Keys in your dashboard
3. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin`
   - `userPinnedDataTotal`

## API Endpoints

### General Upload Endpoints

#### Upload Single File
```http
POST /upload/single
Content-Type: multipart/form-data

Body:
- file: (binary)
```

#### Upload Multiple Files
```http
POST /upload/multiple
Content-Type: multipart/form-data

Body:
- files: (binary array, max 10 files)
```

### Specialized Upload Endpoints

#### Profile Picture
```http
POST /upload/profile-picture
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body:
- file: (image file, max 5MB)
```

#### Product Images
```http
POST /upload/product-images/:productId
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body:
- files: (image files, max 10 files, 10MB each)
```

#### KYC Documents
```http
POST /upload/kyc-documents
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body:
- files: (documents, max 5 files, 15MB each)
- documentType: string (identity, proofOfAddress, etc.)
```

#### Vendor Logo
```http
POST /upload/vendor/logo
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body:
- file: (image file, max 2MB)
```

#### Vendor Banner
```http
POST /upload/vendor/banner
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body:
- file: (image file, max 8MB)
```

## File Type Validations

| File Type | Allowed Formats | Max Size | Max Files |
|-----------|----------------|----------|-----------|
| Profile Picture | JPEG, JPG, PNG, WebP | 5MB | 1 |
| Product Images | JPEG, JPG, PNG, WebP | 10MB | 10 |
| KYC Documents | JPEG, JPG, PNG, WebP, PDF, DOC, DOCX | 15MB | 5 |
| Vendor Logo | JPEG, JPG, PNG, WebP, SVG | 2MB | 1 |
| Vendor Banner | JPEG, JPG, PNG, WebP | 8MB | 1 |

## Database Schema Updates

### User Schema
```typescript
// Profile with Pinata URIs
profile: {
  avatar: string,           // Legacy field
  avatarUri: string,        // Pinata IPFS URI
  avatarHash: string,       // IPFS hash for deletion
  // ... other fields
}

// KYC Documents
kycDocuments: {
  identityDocumentType: 'passport' | 'national_id' | 'drivers_license',
  identityDocumentUri: string,
  identityDocumentHash: string,
  proofOfAddressUri: string,
  proofOfAddressHash: string,
  verificationStatus: 'pending' | 'approved' | 'rejected',
  // ... other fields
}
```

### Product Schema
```typescript
// Legacy images array (maintained for compatibility)
images: string[],

// New structured image data
imageUris: [{
  uri: string,              // Pinata IPFS URI
  hash: string,             // IPFS hash
  originalName: string,     // Original filename
  isPrimary: boolean,       // Primary product image
  uploadedAt: Date,
}],
```

### Vendor Schema
```typescript
storeSettings: {
  logo: string,             // Legacy field
  logoUri: string,          // Pinata IPFS URI
  logoHash: string,         // IPFS hash
  banner: string,           // Legacy field
  bannerUri: string,        // Pinata IPFS URI
  bannerHash: string,       // IPFS hash
  // ... other fields
}

kycDocuments: {
  identityDocumentUri: string,
  identityDocumentHash: string,
  businessCertificateUri: string,
  businessCertificateHash: string,
  taxCertificateUri: string,
  taxCertificateHash: string,
  bankStatementUri: string,
  bankStatementHash: string,
  verificationStatus: 'pending' | 'approved' | 'rejected',
  // ... other fields
}
```

## Service Methods

### PinataService
```typescript
// Upload single file
uploadFile(file: Express.Multer.File, fileType: FileType, metadata?: Record<string, any>): Promise<FileUploadResult>

// Upload multiple files
uploadMultipleFiles(files: Express.Multer.File[], fileType: FileType, metadata?: Record<string, any>): Promise<FileUploadResult[]>

// Delete file from IPFS
deleteFile(hash: string): Promise<boolean>

// Get file information
getFileInfo(hash: string): Promise<any>
```

### FileUploadService
```typescript
// Specialized upload methods
uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<FileUploadResult>
uploadProductImages(files: Express.Multer.File[], productId: string, vendorId: string): Promise<FileUploadResult[]>
uploadKycDocuments(files: Express.Multer.File[], userId: string, documentType: string): Promise<FileUploadResult[]>
uploadVendorLogo(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult>
uploadVendorBanner(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult>
```

## Response Format

All upload endpoints return the following format:

```json
{
  "message": "File uploaded successfully",
  "uri": "https://gateway.pinata.cloud/ipfs/QmHash...",
  "hash": "QmHash...",
  "size": 1234567,
  "originalName": "filename.jpg"
}
```

For multiple file uploads:

```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "uri": "https://gateway.pinata.cloud/ipfs/QmHash1...",
      "hash": "QmHash1...",
      "size": 1234567,
      "originalName": "file1.jpg"
    },
    {
      "uri": "https://gateway.pinata.cloud/ipfs/QmHash2...",
      "hash": "QmHash2...",
      "size": 2345678,
      "originalName": "file2.jpg"
    }
  ]
}
```

## Error Handling

Common error responses:

```json
{
  "statusCode": 400,
  "message": "File size too large. Maximum 5MB allowed.",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Invalid file type. Allowed types: image/jpeg, image/png, image/webp",
  "error": "Bad Request"
}
```

## Migration from NFT.Storage

The system maintains backward compatibility with existing NFT.Storage URLs while new uploads use Pinata. To fully migrate:

1. Update environment variables to use Pinata
2. Existing files will continue to work with their current URLs
3. New uploads will automatically use Pinata
4. Gradually migrate existing files if needed

## Best Practices

1. **File Optimization**: Compress images before upload to reduce costs
2. **Metadata**: Use meaningful metadata for better file organization
3. **Error Handling**: Always handle upload failures gracefully
4. **Progress Indication**: Show upload progress for large files
5. **File Validation**: Validate files on both client and server side

## Security Considerations

- All uploads require authentication (JWT token)
- File type validation prevents malicious uploads
- Size limits prevent abuse
- IPFS hashes are stored for potential file deletion
- Files are organized by type using Pinata groups

## Cost Optimization

- Use appropriate file types and compression
- Implement client-side image resizing
- Set reasonable file size limits
- Monitor Pinata usage dashboard
- Consider implementing file cleanup for deleted resources

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check Pinata JWT token validity
2. **File Too Large**: Verify size limits in validation rules
3. **Invalid File Type**: Check allowed MIME types
4. **Network Issues**: Implement retry logic for uploads

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed upload logs.