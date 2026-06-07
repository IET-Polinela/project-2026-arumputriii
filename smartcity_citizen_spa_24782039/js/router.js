const routes = {
    '#login': `
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h4 class="mb-3 text-center">
                            <i class="bi bi-person-circle"></i>
                            Login Citizen
                        </h4>

                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" id="username" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">
                                <i class="bi bi-box-arrow-in-right"></i>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};

function handleRouting() {
    const hash = window.location.hash || '#login';
    const appContent = document.getElementById('app-content');

    if (hash === '#dashboard') {
        renderDashboardLayout();
        return;
    }

    appContent.innerHTML = routes[hash] || routes['#login'];

    if (hash === '#login') {
        setupLoginForm();
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);