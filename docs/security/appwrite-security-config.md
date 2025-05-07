# Appwrite Security Configuration for Up4It

## App Configuration

- **Project ID**: 6811f9090020cdcb835a
- **API Endpoint**: https://fra.cloud.appwrite.io/v1

## Security Measures

### Authentication Configuration

1. **Email Authentication**

   - Restrict to university domains (@student.ubc.ca, @alumni.ubc.ca)
   - Require email verification before account activation
   - Set password requirements (min 8 chars, mixed character types)
   - Set session duration to 14 days maximum

2. **JWT Configuration**
   - Use short expiration times (1 hour)
   - Implement refresh token mechanism
   - Verify signature and expiration on each request

### Database Security

1. **Collection-level Permissions**

   - Define strict read/write permissions based on user roles
   - Implement document-level security for user data
   - Use Appwrite's attribute-level security where needed

2. **Data Validation**
   - Define and enforce data schemas for all collections
   - Implement server-side validation rules
   - Set appropriate data types and constraints

### Storage Security

1. **File Access Control**

   - Use signed URLs for temporary file access
   - Implement file-level permissions
   - Validate file types and content before storage
   - Set maximum file sizes and rate limits

2. **Media Processing**
   - Configure image optimization and resizing
   - Implement virus/malware scanning for uploads
   - Remove EXIF and metadata from uploaded images

### Functions & API Security

1. **Server-side Functions**

   - Implement function-level authentication
   - Configure appropriate execution permissions
   - Manage environment variables securely
   - Set execution limits and timeouts

2. **API Security**
   - Use API keys with appropriate scopes
   - Implement rate limiting and request throttling
   - Configure CORS policies appropriately
   - Monitor suspicious API activity

## Implementation Plan

### 1. Initial Setup

```javascript
// Example: Setting up email authentication with domain restrictions
const appwrite = new Appwrite();
appwrite
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6811f9090020cdcb835a");

// Restrict email domains during sign-up
const validateEmail = (email) => {
  const allowedDomains = ["student.ubc.ca", "alumni.ubc.ca"];
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
};

// Example sign-up function with domain validation
const createAccount = async (email, password, name) => {
  if (!validateEmail(email)) {
    throw new Error("Only university email domains are allowed");
  }

  try {
    const user = await appwrite.account.create(
      "unique()",
      email,
      password,
      name
    );

    // Send verification email
    await appwrite.account.createVerification("https://up4it.app/verify-email");

    return user;
  } catch (error) {
    console.error("Account creation failed:", error);
    throw error;
  }
};
```

### 2. Collection Security Settings

```javascript
// Define collection-level permissions
// Users can only read and update their own profiles
// Example collection structure:
/*
Collection: profiles
Rules:
- Read: document("user_id") === auth.id
- Create: auth.status === true
- Update: document("user_id") === auth.id
- Delete: document("user_id") === auth.id
*/
```

### 3. Storage Security Configuration

```javascript
// Example: Secure file upload
const uploadProfilePicture = async (file) => {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large");
  }

  try {
    // Upload with user-specific permissions
    const result = await appwrite.storage.createFile(
      "PROFILE_BUCKET_ID",
      "unique()",
      file,
      ["role:member"],
      [`user:${user.id}`]
    );

    return result;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
```

## Security Monitoring

1. **Activity Logs**

   - Configure audit logging for all authentication activities
   - Set up alerts for suspicious activities
   - Monitor failed authentication attempts

2. **Regular Audits**
   - Perform quarterly security audits of Appwrite configuration
   - Update security settings based on new features or threats
   - Document all security changes and updates

## Disaster Recovery

1. **Backup Strategy**

   - Configure automatic database backups
   - Set appropriate backup retention periods
   - Test restoration procedures regularly

2. **Incident Response**
   - Define security incident response plan
   - Document escalation procedures
   - Prepare communication templates for security incidents

This document should be treated as confidential and updated regularly as the security configuration evolves.
