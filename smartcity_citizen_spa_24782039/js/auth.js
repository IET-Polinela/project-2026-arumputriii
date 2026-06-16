function setupLoginForm() {
    const form = document.getElementById('loginForm');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await requestAPI('/api/token/', 'POST', {
            username: username,
            password: password
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem("username", username);

            updateNavbar();

            alert('Login berhasil');
            window.location.hash = '#dashboard';
        } else {
            alert('Username atau password salah');
        }
    });
}