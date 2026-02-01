# Security Best Practices

This document outlines the security measures implemented in the KuraKampus frontend application.

## Table of Contents

1. [XSS Protection](#xss-protection)
2. [CSRF Protection](#csrf-protection)
3. [Input Sanitization](#input-sanitization)
4. [Authentication Security](#authentication-security)
5. [Environment Variables](#environment-variables)
6. [Content Security Policy](#content-security-policy)
7. [Rate Limiting](#rate-limiting)
8. [Secure Headers](#secure-headers)

## XSS Protection

Cross-Site Scripting (XSS) protection is implemented through multiple layers:

### HTML Escaping

```typescript
import { escapeHtml } from '@/utils/security';

// Escape user input before displaying
const safeText = escapeHtml(userInput);
```

### HTML Sanitization

```typescript
import { sanitizeHtml } from '@/utils/security';

// Sanitize HTML content
const safeHtml = sanitizeHtml(richTextContent);
```

### XSS Detection

```typescript
import { containsXss } from '@/utils/security';

// Check if input contains XSS patterns
if (containsXss(userInput)) {
  // Handle potential XSS attack
}
```

## CSRF Protection

Cross-Site Request Forgery (CSRF) protection is enabled by default for state-changing requests.

### Automatic CSRF Tokens

The API client automatically adds CSRF tokens to POST, PUT, PATCH, and DELETE requests:

```typescript
// CSRF token is automatically added in API interceptor
await api.post('/users', userData);
```

### Manual CSRF Token Management

```typescript
import { csrfTokenManager } from '@/utils/security';

// Get current token
const token = csrfTokenManager.getToken();

// Generate new token
const newToken = csrfTokenManager.generateNewToken();

// Validate token
const isValid = csrfTokenManager.validateToken(receivedToken);
```

### Configuration

Enable/disable CSRF protection in `.env`:

```env
VITE_ENABLE_CSRF=true
```

## Input Sanitization

All user inputs should be sanitized before processing:

### Basic Input Sanitization

```typescript
import { sanitizeInput } from '@/utils/security';

const safeInput = sanitizeInput(userInput);
```

### URL Sanitization

```typescript
import { sanitizeUrl } from '@/utils/security';

const safeUrl = sanitizeUrl(userProvidedUrl);
```

### Filename Validation

```typescript
import { SecurityValidation } from '@/utils/security';

if (SecurityValidation.isValidFilename(filename)) {
  // Process file
}
```

## Authentication Security

### JWT Token Management

- Tokens are stored in secure storage
- Automatic token refresh before expiration
- Tokens are cleared on logout

### Password Security

```typescript
import { checkPasswordStrength } from '@/utils/security';

const { score, feedback } = checkPasswordStrength(password);

// score: 0-6 (0 = weak, 6 = very strong)
// feedback: array of improvement suggestions
```

### Login Rate Limiting

```typescript
import { RateLimiter } from '@/utils/security';

const loginLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

if (!loginLimiter.isAllowed(userEmail)) {
  // Too many attempts, block login
}
```

## Environment Variables

### Secure Environment Variables

Never commit sensitive data to version control:

```env
# ❌ DON'T DO THIS
VITE_API_KEY=your-secret-key-here

# ✅ DO THIS
# Use .env.local (gitignored)
VITE_API_KEY=actual-secret-key
```

### Runtime Environment Access

```typescript
// Access environment variables safely
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error('API key is required');
}
```

## Content Security Policy

Content Security Policy headers should be configured on the backend, but the frontend includes CSP helpers:

```typescript
import { CSP } from '@/utils/security';

// Generate nonce for inline scripts
const nonce = CSP.generateNonce();

// Validate nonce
const isValid = CSP.validateNonce(receivedNonce, expectedNonce);
```

## Rate Limiting

Protect against brute force attacks with rate limiting:

```typescript
import { RateLimiter } from '@/utils/security';

// Create rate limiter (10 requests per 60 seconds)
const limiter = new RateLimiter(10, 60000);

// Check if request is allowed
if (!limiter.isAllowed(userId)) {
  // Rate limit exceeded
  return;
}

// Reset limits for specific user
limiter.reset(userId);
```

## Secure Headers

The application includes security headers in API requests:

```typescript
import { SECURITY_HEADERS } from '@/utils/security';

// Headers are automatically added by the API client
// Manual usage:
const response = await fetch(url, {
  headers: {
    ...SECURITY_HEADERS,
    ...customHeaders,
  },
});
```

### Recommended Headers

- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - Enable XSS filtering
- `Strict-Transport-Security` - Enforce HTTPS
- `Referrer-Policy` - Control referrer information

## Best Practices Checklist

### Input Handling

- [ ] Sanitize all user inputs
- [ ] Validate file uploads
- [ ] Check URLs before navigation
- [ ] Escape HTML content
- [ ] Use parameterized queries (backend)

### Authentication

- [ ] Use strong password requirements
- [ ] Implement rate limiting on login
- [ ] Store tokens securely
- [ ] Implement token refresh
- [ ] Clear sensitive data on logout

### Data Protection

- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for all requests
- [ ] Implement CSRF protection
- [ ] Validate all API responses
- [ ] Never log sensitive data

### Code Security

- [ ] Keep dependencies updated
- [ ] Run security audits regularly
- [ ] Use TypeScript strict mode
- [ ] Implement proper error handling
- [ ] Review code for security issues

## Security Utilities Usage Examples

### Complete Form Security

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { sanitizeInput, containsXss } from '@/utils/security';
  import { useForm } from '@/composables/useForm';

  const { formData, validate, submit } = useForm({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async () => {
    // Check for XSS
    if (containsXss(formData.message)) {
      alert('Invalid input detected');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
    };

    await submit(async () => {
      await api.post('/contact', sanitizedData);
    });
  };
</script>
```

### Protected Route with Rate Limiting

```typescript
import { RateLimiter } from '@/utils/security';

const loginLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    const identifier = sessionStorage.getItem('login_identifier') || 'anonymous';

    if (!loginLimiter.isAllowed(identifier)) {
      return next({
        name: 'rate-limited',
        query: { reason: 'Too many login attempts' },
      });
    }
  }

  next();
});
```

## Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** disclose it publicly
2. Contact the security team immediately
3. Provide detailed information about the vulnerability
4. Wait for acknowledgment before taking further action

## Regular Security Tasks

### Daily

- Monitor application logs for suspicious activity
- Review failed authentication attempts

### Weekly

- Check for dependency updates
- Review recent code changes for security issues

### Monthly

- Run security audit (`npm audit`)
- Update dependencies with security patches
- Review and rotate API keys if needed

### Quarterly

- Conduct security code review
- Penetration testing
- Update security documentation

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [TypeScript Security Patterns](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)

## Contact

For security concerns, contact: security@kurakampus.com
