# Authentication System Documentation

## Overview

The Abuja E-Mall backend implements a comprehensive authentication system using JWT (JSON Web Tokens) with support for multiple authentication methods including email/password, Google OAuth, and role-based access control.

## Features

- **JWT-based Authentication**: Secure token-based authentication
- **Multiple User Roles**: Customer, Vendor, Admin roles with different permissions
- **Google OAuth Integration**: Sign-in with Google accounts
- **Password Reset**: Secure password reset via email
- **Email Verification**: Email verification for new accounts
- **Rate Limiting**: Protection against brute force attacks
- **Refresh Tokens**: Long-lived refresh tokens for seamless user experience
- **Role-based Authorization**: Fine-grained access control

## Authentication Flow

### 1. User Registration

#### Customer Registration
```http
POST /api/auth/register/customer
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "customer@example.com",
  "password": "password123",
  "phoneNumber": "+2348012345678"
}
```

#### Vendor Registration
```http
POST /api/auth/register/vendor
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "password123",
  "fullName": "Jane Smith",
  "businessName": "Smith Enterprises",
  "businessPhoneNumber": "+2348012345678",
  "businessAddress": "123 Business St, Abuja",
  "businessCategory": "Electronics"
}
```

### 2. User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "roles": ["customer"],
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### 3. Google OAuth

#### Customer Google Sign-in
```http
POST /api/auth/google/customer
Content-Type: application/json

{
  "idToken": "google_id_token_from_client"
}
```

#### Vendor Google Sign-in
```http
POST /api/auth/google/vendor
Content-Type: application/json

{
  "idToken": "google_id_token_from_client",
  "businessName": "Smith Enterprises",
  "businessPhoneNumber": "+2348012345678",
  "businessAddress": "123 Business St, Abuja",
  "businessCategory": "Electronics",
  "fullName": "Jane Smith"
}
```

### 4. Token Refresh

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Password Reset

#### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

### 6. Email Verification

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Resend Verification
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 7. Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

## Authorization

### Role-based Access Control

The system supports three user roles:

- **CUSTOMER**: Can browse products, make purchases, manage profile
- **VENDOR**: Can manage products, orders, analytics, store settings
- **ADMIN**: Full system access, user management, platform analytics

### Using Guards

#### JWT Authentication Guard
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
getProtectedData() {
  return { message: 'This is protected data' };
}
```

#### Role-based Authorization
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
getAdminData() {
  return { message: 'Admin only data' };
}
```

#### Public Routes
```typescript
@Public()
@Get('public-route')
getPublicData() {
  return { message: 'This is public data' };
}
```

### Current User Decorator

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: any) {
  return user;
}

@UseGuards(JwtAuthGuard)
@Get('user-id')
getUserId(@CurrentUser('_id') userId: string) {
  return { userId };
}
```

## Security Features

### Rate Limiting

Authentication endpoints are protected with rate limiting to prevent brute force attacks:

- **Login attempts**: Limited per IP address
- **Registration**: Limited per IP address
- **Password reset**: Limited per IP address
- **Email verification**: Limited per IP address

### Password Security

- Passwords are hashed using bcrypt with salt rounds of 10
- Minimum password length of 6 characters
- Password validation on both client and server side

### Token Security

- **Access tokens**: Short-lived (1 hour) for security
- **Refresh tokens**: Long-lived (7 days) for user convenience
- **JWT secret**: Configurable via environment variables
- **Token blacklisting**: Refresh tokens can be invalidated on logout

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Database
MONGODB_URI=mongodb://localhost:27017/abuja-emall

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Error Handling

The authentication system provides comprehensive error handling:

### Common Error Responses

```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": ["Email must be a valid email address"],
  "error": "Bad Request"
}

// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}

// 429 Too Many Requests
{
  "statusCode": 429,
  "message": "Too many authentication attempts. Please try again later.",
  "error": "Too Many Requests"
}
```

## Testing

The authentication system includes comprehensive unit tests:

```bash
# Run authentication tests
npm run test auth

# Run specific test files
npm run test auth.controller.spec.ts
npm run test auth.service.spec.ts
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3001/api/docs`
- **Authentication endpoints**: Available under the "Authentication" tag

## Best Practices

### Frontend Integration

1. **Store tokens securely**: Use httpOnly cookies or secure storage
2. **Handle token expiration**: Implement automatic token refresh
3. **Show loading states**: During authentication operations
4. **Validate forms**: Client-side validation before API calls

### Backend Development

1. **Use guards consistently**: Apply authentication guards to protected routes
2. **Validate input**: Use DTOs with class-validator decorators
3. **Handle errors gracefully**: Provide meaningful error messages
4. **Log security events**: Monitor authentication attempts and failures

## Troubleshooting

### Common Issues

1. **Token expiration**: Implement refresh token logic
2. **CORS issues**: Ensure frontend URL is configured correctly
3. **Google OAuth**: Verify client ID and secret are correct
4. **Rate limiting**: Check if requests are being throttled

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## Security Considerations

1. **Never log sensitive data**: Passwords, tokens, or personal information
2. **Use HTTPS in production**: Encrypt all authentication traffic
3. **Regular security audits**: Review authentication flows regularly
4. **Monitor for attacks**: Set up alerts for suspicious activity
5. **Keep dependencies updated**: Regularly update authentication libraries

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login providers (Facebook, Twitter)
- [ ] Account lockout after failed attempts
- [ ] Session management dashboard
- [ ] Advanced audit logging
- [ ] Biometric authentication support
