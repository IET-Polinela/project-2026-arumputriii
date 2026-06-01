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
    `,

    '#dashboard': `
        <h3 class="mb-4">
            <i class="bi bi-speedometer2"></i>
            Dashboard Citizen
        </h3>

        <div class="row g-3">
            <div class="col-12 col-lg-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5><i class="bi bi-person"></i> Profil</h5>
                        <p class="text-muted">Informasi warga.</p>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5><i class="bi bi-megaphone"></i> Laporan Terbaru</h5>
                        <p class="text-muted">Daftar laporan akan ditampilkan di sini.</p>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5><i class="bi bi-bell"></i> Notifikasi</h5>
                        <p class="text-muted">Belum ada notifikasi.</p>
                    </div>
                </div>
            </div>
        </div>
    `
};

function handleRouting() {
    const hash = window.location.hash || '#login';
    const appContent = document.getElementById('app-content');

    appContent.innerHTML = routes[hash] || routes['#login'];

    if (hash === '#login') {
        setupLoginForm();
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);