document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadTools();
    setupSearchListener();
});

async function checkAuth() {
    const token = getToken();
    const authNav = document.getElementById('authNav');
    const userNav = document.getElementById('userNav');
    const adminNav = document.getElementById('adminNav');

    if (token) {
        try {
            const user = await getUserProfile();
            if (authNav) authNav.style.display = 'none';
            if (userNav) userNav.style.display = 'block';
            if (adminNav && user.role === 'admin') adminNav.style.display = 'block';
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    } else {
        if (authNav) authNav.style.display = 'block';
        if (userNav) userNav.style.display = 'none';
        if (adminNav) adminNav.style.display = 'none';
    }
}

async function loadTools() {
    showLoader('Loading tools...');
    try {
        const tools = await getTools();
        displayTools(tools);
    } catch (error) {
        console.error('Error loading tools:', error);
        displayTools([]);
    } finally {
        hideLoader();
    }
}

function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(searchToolsByName, 300));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function searchToolsByName() {
    const query = document.getElementById('searchInput')?.value || '';
    if (!query) {
        loadTools();
        return;
    }

    showLoader('Searching...');
    try {
        const tools = await getTools();
        const filtered = tools.filter(tool => 
            tool.tool_name.toLowerCase().includes(query.toLowerCase()) ||
            (tool.use_case && tool.use_case.toLowerCase().includes(query.toLowerCase()))
        );
        displayTools(filtered);
    } catch (error) {
        console.error('Error searching tools:', error);
    } finally {
        hideLoader();
    }
}

function displayTools(tools) {
    const toolsList = document.getElementById('toolsList');
    if (!toolsList) return;

    if (!Array.isArray(tools) || tools.length === 0) {
        toolsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No tools found</p>';
        return;
    }

    toolsList.innerHTML = tools.map(tool => `
        <div class="tool-card" onclick="goToTool('${tool.id}')">
            <h3>${escapeHtml(tool.tool_name)}</h3>
            <p class="use-case">${escapeHtml(tool.use_case || 'No description')}</p>
            <span class="category">${escapeHtml(tool.category || 'Uncategorized')}</span>
            <p class="pricing">${tool.pricing_type}</p>
            <div class="tool-rating">★ ${tool.avg_rating.toFixed(1)}/5</div>
        </div>
    `).join('');
}

function goToTool(toolId) {
    window.location.href = `tool-detail.html?id=${toolId}`;
}

function searchTools() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        window.location.href = `tools.html?search=${encodeURIComponent(query)}`;
    }
}

async function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const pricing = document.getElementById('pricingFilter').value;
    const rating = document.getElementById('ratingFilter').value;

    showLoader('Filtering tools...');
    try {
        const tools = await getTools(category, pricing, rating);
        displayTools(tools);
    } catch (error) {
        console.error('Error filtering tools:', error);
        alert('Error applying filters. Please try again.');
    } finally {
        hideLoader();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}