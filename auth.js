document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin();
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleRegister();
});

async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await loginUser(username, password);
        if (data.access_token) {
            setToken(data.access_token);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showMessage(data.detail || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Login error: ' + error.message, 'error');
    }
}

async function handleRegister() {
    const userData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        first_name: document.getElementById('regFirstName').value,
        last_name: document.getElementById('regLastName').value,
        password: document.getElementById('regPassword').value,
        role: document.getElementById('regRole').value
    };

    try {
        const response = await registerUser(userData);
        if (response.msg) {
            showMessage(response.msg + ' Please login now.', 'success');
            setTimeout(() => toggleAuthForm(), 2000);
        } else {
            showMessage(response.detail || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Registration error: ' + error.message, 'error');
    }
}

function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const toggleText = document.getElementById('toggleText');

    loginForm.style.display = loginForm.style.display === 'none' ? 'flex' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'flex' : 'none';

    if (loginForm.style.display === 'none') {
        authTitle.textContent = 'Register';
        toggleText.innerHTML = 'Already have an account? <button type="button" onclick="toggleAuthForm()">Login</button>';
    } else {
        authTitle.textContent = 'Login';
        toggleText.innerHTML = 'Don\'t have an account? <button type="button" onclick="toggleAuthForm()">Register</button>';
    }
}

function showMessage(message, type) {
    const messageEl = document.getElementById('authMessage');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}