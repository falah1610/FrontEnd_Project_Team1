// Use a fixed backend URL to match running Uvicorn instance
const API_BASE_URL = 'http://127.0.0.1:8080';

// ========== Token Management ==========
function getToken() {
    return localStorage.getItem('access_token');
}

function setToken(token) {
    localStorage.setItem('access_token', token);
}

function removeToken() {
    localStorage.removeItem('access_token');
}

function getAuthHeader() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ========== Auth API ==========
async function registerUser(userData) {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
}

async function loginUser(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        body: formData
    });
    return response.json();
}

// ========== User API ==========
async function getUserProfile() {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/user/`, {
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            password: currentPassword,
            new_password: newPassword
        })
    });
    return response;
}

// ========== Error Handling Wrapper =========
async function fetchWithErrorHandling(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== Tools API ==========
async function getTools(category = '', pricingType = '', minRating = '') {
    let url = `${API_BASE_URL}/admin/tools/search?`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (pricingType) url += `pricing_type=${pricingType}&`;
    if (minRating) url += `min_rating=${minRating}`;

    try {
        // include auth header for protected admin endpoint
        const response = await fetchWithErrorHandling(
            url.replace(/&$/, ''),
            { headers: { ...getAuthHeader() } }
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching tools:', error);
        return [];
    }
}

async function getToolById(toolId) {
    const response = await fetch(`${API_BASE_URL}/admin/tools/${toolId}`, {
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function addTool(toolData) {
    const response = await fetch(`${API_BASE_URL}/admin/add_tool`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(toolData)
    });
    return response.json();
}

async function updateTool(toolId, toolData) {
    const response = await fetch(`${API_BASE_URL}/admin/Update_tool/${toolId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(toolData)
    });

    // If response has no body (204 No Content), return null to avoid JSON parse error
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (err) {
        // Fallback: return raw text if JSON parsing fails
        return text;
    }
}

async function deleteTool(toolId) {
    const response = await fetch(`${API_BASE_URL}/admin/delete_tool/${toolId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
    });
    return response;
}

// ========== Reviews API ==========
async function submitReview(toolId, rating, comment) {
    const response = await fetch(`${API_BASE_URL}/admin/user_add_review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            tool_id: toolId,
            user_rating: rating,
            comment: comment
        })
    });
    return response.json();
}

async function getApprovedReviews() {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/approved`, {
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function getPendingReviews() {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/pending`, {
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function getAllReviews() {
    const response = await fetch(`${API_BASE_URL}/admin/all_reviews`, {
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function approveReview(reviewId) {
    const response = await fetch(`${API_BASE_URL}/admin/approve_review/${reviewId}?approval_status=APPROVED`, {
        method: 'PUT',
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

async function rejectReview(reviewId) {
    const response = await fetch(`${API_BASE_URL}/admin/approve_review/${reviewId}?approval_status=REJECTED`, {
        method: 'PUT',
        headers: { ...getAuthHeader() }
    });
    return response.json();
}

// ========== Loader Helpers ==========
function showLoader(text = 'Loading...') {
    try {
        let overlay = document.getElementById('loaderOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loaderOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            `;
            overlay.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div style="border: 4px solid rgba(255, 255, 255, 0.2); border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <div id="loaderText" style="margin-top: 10px; font-size: 14px;">Loading...</div>
                </div>
            `;
            const style = document.createElement('style');
            style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
            document.body.appendChild(overlay);
        }
        const loaderText = overlay.querySelector('#loaderText');
        if (loaderText) loaderText.textContent = text;
        overlay.style.display = 'flex';
    } catch (e) {
        console.warn('showLoader error:', e);
    }
}

function hideLoader() {
    try {
        const overlay = document.getElementById('loaderOverlay');
        if (overlay) overlay.style.display = 'none';
    } catch (e) {
        console.warn('hideLoader error:', e);
    }
}