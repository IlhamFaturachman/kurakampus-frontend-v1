/**
 * Security Utilities
 * XSS protection, CSRF handling, and input sanitization
 */

/**
 * HTML entities map for escaping
 */
const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
};

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(str: string): string {
    return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char] ?? char);
}

/**
 * Sanitize HTML by removing dangerous tags and attributes
 */
export function sanitizeHtml(html: string): string {
    // Create a temporary div element
    const temp = document.createElement('div');
    temp.textContent = html;

    // List of allowed tags
    const allowedTags = [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'span',
        'div',
    ];

    // List of allowed attributes
    const allowedAttributes: Record<string, string[]> = {
        a: ['href', 'title', 'target'],
        img: ['src', 'alt', 'title'],
    };

    // Parse and sanitize
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove all script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach((script) => script.remove());

    // Remove event handlers and dangerous attributes
    const allElements = doc.querySelectorAll('*');
    allElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();

        // Remove disallowed tags
        if (!allowedTags.includes(tagName)) {
            element.remove();
            return;
        }

        // Remove disallowed attributes
        const attributes = Array.from(element.attributes);
        attributes.forEach((attr) => {
            const attrName = attr.name.toLowerCase();

            // Remove event handlers
            if (attrName.startsWith('on')) {
                element.removeAttribute(attr.name);
                return;
            }

            // Check if attribute is allowed for this tag
            const allowedAttrs = allowedAttributes[tagName] ?? [];
            if (!allowedAttrs.includes(attrName)) {
                element.removeAttribute(attr.name);
            }
        });
    });

    return doc.body.innerHTML;
}

/**
 * Strip all HTML tags from string
 */
export function stripHtml(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent ?? temp.innerText ?? '';
}

/**
 * Sanitize user input by removing dangerous characters
 */
export function sanitizeInput(input: string): string {
    // Remove control characters
    // eslint-disable-next-line no-control-regex
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Escape HTML
    sanitized = escapeHtml(sanitized);

    return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error('Invalid protocol');
        }

        return parsed.href;
    } catch {
        // Return empty string for invalid URLs
        return '';
    }
}

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF Token Manager
 */
class CsrfTokenManager {
    private tokenKey = 'csrf_token';
    private token: string | null = null;

    /**
     * Get or generate CSRF token
     */
    getToken(): string {
        this.token ??= this.loadToken() ?? this.generateNewToken();
        return this.token;
    }

    /**
     * Generate new CSRF token
     */
    generateNewToken(): string {
        const token = generateCsrfToken();
        this.token = token;
        this.saveToken(token);
        return token;
    }

    /**
     * Validate CSRF token
     */
    validateToken(token: string): boolean {
        return token === this.getToken();
    }

    /**
     * Clear CSRF token
     */
    clearToken(): void {
        this.token = null;
        sessionStorage.removeItem(this.tokenKey);
    }

    /**
     * Save token to session storage
     */
    private saveToken(token: string): void {
        sessionStorage.setItem(this.tokenKey, token);
    }

    /**
     * Load token from session storage
     */
    private loadToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }
}

/**
 * CSRF token manager instance
 */
export const csrfTokenManager = new CsrfTokenManager();

/**
 * Content Security Policy helpers
 */
export const CSP = {
    /**
     * Generate CSP nonce for inline scripts
     */
    generateNonce(): string {
        return generateCsrfToken();
    },

    /**
     * Check if script nonce is valid
     */
    validateNonce(nonce: string, validNonce: string): boolean {
        return nonce === validNonce;
    },
};

/**
 * Secure random string generator
 */
export function generateSecureRandomString(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if string contains potential XSS attack
 */
export function containsXss(input: string): boolean {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<embed/gi,
        /<object/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
    private requests: Map<string, number[]> = new Map();

    constructor(
        private maxRequests: number = 10,
        private timeWindow: number = 60000
    ) { }

    /**
     * Check if request is allowed
     */
    isAllowed(key: string): boolean {
        const now = Date.now();
        const requests = this.requests.get(key) ?? [];

        // Filter out old requests
        const recentRequests = requests.filter((timestamp) => now - timestamp < this.timeWindow);

        if (recentRequests.length >= this.maxRequests) {
            return false;
        }

        // Add current request
        recentRequests.push(now);
        this.requests.set(key, recentRequests);

        return true;
    }

    /**
     * Reset rate limit for key
     */
    reset(key: string): void {
        this.requests.delete(key);
    }

    /**
     * Clear all rate limits
     */
    clearAll(): void {
        this.requests.clear();
    }
}

/**
 * Input validation helpers
 */
export const SecurityValidation = {
    /**
     * Check if string is safe for SQL (basic check)
     */
    isSafeSql(input: string): boolean {
        const sqlInjectionPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
            /(--|\/\*|\*\/|;)/g,
            /('|")\s*(OR|AND)\s*\1/gi,
        ];

        return !sqlInjectionPatterns.some((pattern) => pattern.test(input));
    },

    /**
     * Check if string contains only alphanumeric characters
     */
    isAlphanumeric(input: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(input);
    },

    /**
     * Check if string is a valid filename
     */
    isValidFilename(filename: string): boolean {
        // Disallow path traversal and special characters
        // eslint-disable-next-line no-control-regex
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
        const pathTraversal = /\.\./g;

        return !invalidChars.test(filename) && !pathTraversal.test(filename);
    },
};

/**
 * Password strength checker
 */
export function checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
} {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('Password should be at least 8 characters long');
    }

    if (password.length >= 12) {
        score += 1;
    }

    // Complexity checks
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Include uppercase letters');
    }

    if (/[0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Include numbers');
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Include special characters');
    }

    return { score, feedback };
}

/**
 * Secure headers for API requests
 */
export const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;
