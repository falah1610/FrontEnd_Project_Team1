const urlParams = new URLSearchParams(window.location.search);
const toolId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    if (!toolId) {
        alert('Tool ID not found');
        history.back();
        return;
    }
    await loadToolDetail();
    await loadToolReviews();
});

document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitToolReview();
});

async function loadToolDetail() {
    try {
        // Note: You may need to adjust the API endpoint based on actual backend
        const tools = await getTools();
        const tool = tools.find(t => t.id === toolId);
        
        if (tool) {
            displayToolDetail(tool);
        } else {
            document.getElementById('toolDetail').innerHTML = '<p>Tool not found</p>';
        }
    } catch (error) {
        console.error('Error loading tool detail:', error);
    }
}

function displayToolDetail(tool) {
    const toolDetail = document.getElementById('toolDetail');
    toolDetail.innerHTML = `
        <h2>${tool.tool_name}</h2>
        <div class="tool-detail-info">
            <label>Use Case</label>
            <p>${tool.use_case || 'N/A'}</p>
        </div>
        <div class="tool-detail-info">
            <label>Category</label>
            <p>${tool.category || 'N/A'}</p>
        </div>
        <div class="tool-detail-info">
            <label>Pricing</label>
            <p>${tool.pricing_type}</p>
        </div>
        <div class="tool-detail-info">
            <label>Average Rating</label>
            <p>★ ${tool.avg_rating.toFixed(1)}/5</p>
        </div>
    `;
}

async function loadToolReviews() {
    try {
        const reviews = await getApprovedReviews();
        const toolReviews = reviews.filter(r => r.tool_id === toolId);
        displayReviews(toolReviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!Array.isArray(reviews) || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <p class="review-user">User ID: ${review.user_id}</p>
                    <span class="review-status ${review.approval_status.toLowerCase()}">
                        ${review.approval_status}
                    </span>
                </div>
                <div class="review-rating">★ ${review.user_rating}/5</div>
            </div>
            <p class="review-comment">${review.comment || 'No comment provided'}</p>
        </div>
    `).join('');
}

async function submitToolReview() {
    const token = getToken();
    if (!token) {
        alert('Please login to submit a review');
        window.location.href = 'auth.html';
        return;
    }

    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('reviewComment').value;

    if (!rating) {
        showReviewMessage('Please select a rating', 'error');
        return;
    }

    try {
        const response = await submitReview(toolId, parseInt(rating), comment);
        showReviewMessage('Review submitted successfully!', 'success');
        document.getElementById('reviewForm').reset();
        setTimeout(() => loadToolReviews(), 1500);
    } catch (error) {
        showReviewMessage('Error submitting review: ' + error.message, 'error');
    }
}

function showReviewMessage(message, type) {
    const messageEl = document.getElementById('reviewMessage');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}

function checkAuth() {
    const token = getToken();
    const authNav = document.getElementById('authNav');
    const userNav = document.getElementById('userNav');

    if (token) {
        if (authNav) authNav.style.display = 'none';
        if (userNav) userNav.style.display = 'block';
    } else {
        if (authNav) authNav.style.display = 'block';
        if (userNav) userNav.style.display = 'none';
    }
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}