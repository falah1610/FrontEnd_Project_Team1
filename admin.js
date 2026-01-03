document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        const user = await getUserProfile();
        if (user.role !== 'admin') {
            alert('Admin access required');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        window.location.href = 'auth.html';
    }

    await loadAdminTools();
});

document.getElementById('toolForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addNewTool();
});

document.getElementById('toolEditForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleUpdateTool();
});

async function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Reload reviews when switching to reviews tab
    if (tabName === 'reviews') {
        await loadReviews();
    }
}

async function loadAdminTools() {
    try {
        const tools = await getTools();
        displayAdminTools(tools);
    } catch (error) {
        console.error('Error loading tools:', error);
        showToolMessage('Error loading tools', 'error');
    }
}

function displayAdminTools(tools) {
    const toolsList = document.getElementById('toolsList');
    if (!toolsList) return;

    if (!Array.isArray(tools) || tools.length === 0) {
        toolsList.innerHTML = '<p>No tools found</p>';
        return;
    }

    toolsList.innerHTML = tools.map(tool => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h3>${tool.tool_name}</h3>
                <p><strong>Category:</strong> ${tool.category || 'N/A'}</p>
                <p><strong>Pricing:</strong> ${tool.pricing_type}</p>
                <p><strong>Rating:</strong> ★ ${tool.avg_rating.toFixed(1)}/5</p>
            </div>
            <div class="admin-actions">
                <button class="btn-primary" onclick="editTool('${tool.id}')">Edit</button>
                <button class="btn-danger" onclick="deleteToolConfirm('${tool.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddToolForm() {
    document.getElementById('addToolForm').style.display = 'block';
}

function hideAddToolForm() {
    document.getElementById('addToolForm').style.display = 'none';
    document.getElementById('toolForm').reset();
}

async function addNewTool() {
    const toolData = {
        tool_name: document.getElementById('toolName').value,
        use_case: document.getElementById('toolUseCase').value,
        category: document.getElementById('toolCategory').value,
        pricing_type: document.getElementById('toolPricing').value,
        avg_rating: 0.0
    };

    if (!toolData.tool_name) {
        showToolMessage('Tool name is required', 'error');
        return;
    }

    try {
        const response = await addTool(toolData);
        if (response.id) {
            showToolMessage('Tool added successfully!', 'success');
            document.getElementById('toolForm').reset();
            hideAddToolForm();
            await loadAdminTools();
        } else {
            showToolMessage(response.detail || 'Error adding tool', 'error');
        }
    } catch (error) {
        showToolMessage('Error: ' + error.message, 'error');
    }
}

async function editTool(toolId) {
    try {
        const tools = await getTools();
        const tool = tools.find(t => t.id === toolId);
        if (!tool) {
            showToolMessage('Tool not found', 'error');
            return;
        }

        document.getElementById('editToolId').value = tool.id;
        document.getElementById('editToolName').value = tool.tool_name || '';
        document.getElementById('editToolUseCase').value = tool.use_case || '';
        document.getElementById('editToolCategory').value = tool.category || '';
        document.getElementById('editToolPricing').value = tool.pricing_type || 'FREE';
        showEditToolForm();
    } catch (error) {
        showToolMessage('Error loading tool for edit', 'error');
    }
}

function showEditToolForm() {
    document.getElementById('editToolForm').style.display = 'block';
    document.getElementById('addToolForm').style.display = 'none';
    window.scrollTo({ top: document.getElementById('editToolForm').offsetTop - 20, behavior: 'smooth' });
}

function hideEditToolForm() {
    document.getElementById('editToolForm').style.display = 'none';
    document.getElementById('toolEditForm').reset();
    document.getElementById('editToolMessage').style.display = 'none';
    document.getElementById('addToolForm').style.display = 'none';
}

async function handleUpdateTool() {
    const id = document.getElementById('editToolId').value;
    const updatedData = {
        tool_name: document.getElementById('editToolName').value,
        use_case: document.getElementById('editToolUseCase').value,
        category: document.getElementById('editToolCategory').value,
        pricing_type: document.getElementById('editToolPricing').value,
    };

    try {
        const res = await updateTool(id, updatedData);
        showToolMessage('Tool updated successfully!', 'success');
        hideEditToolForm();
        await loadAdminTools();
    } catch (error) {
        const msgEl = document.getElementById('editToolMessage');
        if (msgEl) {
            msgEl.textContent = error.message || 'Error updating tool';
            msgEl.className = 'message error';
            msgEl.style.display = 'block';
        }
    }
}

async function deleteToolConfirm(toolId) {
    if (confirm('Are you sure you want to delete this tool?')) {
        try {
            await deleteTool(toolId);
            showToolMessage('Tool deleted successfully!', 'success');
            await loadAdminTools();
        } catch (error) {
            showToolMessage('Error deleting tool: ' + error.message, 'error');
        }
    }
}

function showToolMessage(message, type) {
    const messageEl = document.getElementById('toolMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
    }
}

async function loadReviews() {
    try {
        const statusFilter = document.getElementById('reviewStatusFilter');
        const filterValue = statusFilter ? statusFilter.value : '';
        
        let reviews;
        if (filterValue === 'PENDING') {
            reviews = await getPendingReviews();
        } else if (filterValue === 'APPROVED') {
            reviews = await getApprovedReviews();
        } else {
            reviews = await getAllReviews();
        }
        
        displayReviews(reviews);
    } catch (error) {
        const reviewsList = document.getElementById('reviewsList');
        if (reviewsList) {
            reviewsList.innerHTML = '<p style="color: red;">Error loading reviews: ' + error.message + '</p>';
        }
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) {
        return;
    }
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews found</p>';
        return;
    }

    const html = reviews.map(review => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h3>Tool ID: ${review.tool_id}</h3>
                <p><strong>User ID:</strong> ${review.user_id}</p>
                <p><strong>Rating:</strong> ★ ${review.user_rating}/5</p>
                <p><strong>Comment:</strong> ${review.comment || 'No comment'}</p>
                <span class="review-status ${review.approval_status.toLowerCase()}">
                    ${review.approval_status}
                </span>
            </div>
            <div class="admin-actions">
                ${review.approval_status === 'PENDING' ? `
                    <button class="btn-success" onclick="approveReviewAction(${review.id})">Approve</button>
                    <button class="btn-danger" onclick="rejectReviewAction(${review.id})">Reject</button>
                ` : review.approval_status === 'APPROVED' ? `
                    <button class="btn-warning" onclick="rejectReviewAction(${review.id})">Reject</button>
                ` : review.approval_status === 'REJECTED' ? `
                    <button class="btn-success" onclick="approveReviewAction(${review.id})">Approve</button>
                ` : '<span style="color: gray;">No actions available</span>'}
            </div>
        </div>
    `).join('');
    
    reviewsList.innerHTML = html;
}

async function approveReviewAction(reviewId) {
    try {
        await approveReview(reviewId);
        showReviewMessage('Review approved!', 'success');
        await loadReviews();
    } catch (error) {
        showReviewMessage('Error approving review: ' + error.message, 'error');
    }
}

async function rejectReviewAction(reviewId) {
    try {
        await rejectReview(reviewId);
        showReviewMessage('Review rejected!', 'success');
        await loadReviews();
    } catch (error) {
        showReviewMessage('Error rejecting review: ' + error.message, 'error');
    }
}

function showReviewMessage(message, type) {
    const messageEl = document.getElementById('reviewMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
    }
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}