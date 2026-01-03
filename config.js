// ========== Configuration ==========
// Change this to match your backend URL
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
