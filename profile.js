document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    await loadUserProfile();
});

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await changeUserPassword();
});

async function loadUserProfile() {
    try {
        const user = await getUserProfile();
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileName').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('profileRole').textContent = user.role.toUpperCase();
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function changeUserPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!currentPassword || !newPassword) {
        showPasswordMessage('Please fill all fields', 'error');
        return;
    }

    try {
        const response = await changePassword(currentPassword, newPassword);
        if (response.ok) {
            showPasswordMessage('Password changed successfully!', 'success');
            document.getElementById('passwordForm').reset();
        } else {
            showPasswordMessage('Error changing password', 'error');
        }
    } catch (error) {
        showPasswordMessage('Error: ' + error.message, 'error');
    }
}

function showPasswordMessage(message, type) {
    const messageEl = document.getElementById('passwordMessage');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}