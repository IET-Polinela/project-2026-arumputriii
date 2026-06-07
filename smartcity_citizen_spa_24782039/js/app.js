console.log("APP JS LAB 12 DIMUAT");

let currentTab = "my_reports";
let currentPage = 1;
let editingReportId = null;

function updateNavbar() {
    const navbarAuthArea = document.getElementById("navbarAuthArea");

    if (!navbarAuthArea) return;

    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token) {
        navbarAuthArea.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <span class="text-white fw-semibold">
                    <i class="bi bi-person-circle"></i>
                    Halo, ${username || "Warga"}!
                </span>

                <button class="btn btn-outline-light btn-sm" id="btnLogout">
                    <i class="bi bi-box-arrow-right"></i>
                    Keluar
                </button>
            </div>
        `;
    } else {
        navbarAuthArea.innerHTML = `
            <a class="btn btn-outline-light btn-sm" href="#login">
                <i class="bi bi-box-arrow-in-right"></i>
                Login
            </a>
        `;
    }
}

function renderDashboardLayout() {
    const appContent = document.getElementById("app-content");

    appContent.innerHTML = `
        <div class="dashboard-wrapper">
            <div class="mb-4">
                <h3 class="fw-bold mb-1">
                    <i class="bi bi-speedometer2"></i>
                    Dashboard Citizen
                </h3>
                <p class="text-muted mb-0">
                    Kelola laporan pribadi dan lihat feed laporan kota.
                </p>
            </div>

            <div class="row g-4">
                <div class="col-lg-3">
    <div class="card sidebar-card shadow-sm">
        <div class="card-body">

            <h6 class="fw-bold mb-4 text-uppercase">
                Status Laporan Anda
            </h6>

            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <span>
                    <i class="bi bi-pencil-square text-secondary"></i>
                    Draft
                </span>
                <span class="badge rounded-pill bg-secondary" id="draftCount">
                    0
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <span>
                    <i class="bi bi-send-fill text-warning"></i>
                    Diajukan
                </span>
                <span class="badge rounded-pill bg-warning text-dark" id="reportedCount">
                    0
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <span>
                    <i class="bi bi-patch-check-fill text-info"></i>
                    Diverifikasi
                </span>
                <span class="badge rounded-pill bg-info" id="verifiedCount">
                    0
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                <span>
                    <i class="bi bi-gear-fill text-primary"></i>
                    Diproses
                </span>
                <span class="badge rounded-pill bg-primary" id="processCount">
                    0
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center py-3">
                <span>
                    <i class="bi bi-check-circle-fill text-success"></i>
                    Selesai
                </span>
                <span class="badge rounded-pill bg-success" id="doneCount">
                    0
                </span>
            </div>

        </div>
    </div>
</div>

                <div class="col-lg-9">
                    <div class="toolbar mb-3">
                        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                            <div>
                                <button class="btn btn-primary btn-sm" id="tabMyReports">
                                    <i class="bi bi-folder-fill"></i>
                                    Laporan Saya
                                </button>

                                <button class="btn btn-outline-primary btn-sm" id="tabFeed">
                                    <i class="bi bi-globe2"></i>
                                    Feed Kota (Publik)
                                </button>
                            </div>

                            <div id="addReportButtonContainer"></div>
                        </div>
                    </div>

                    <div id="reportList"></div>
                    <div id="paginationContainer" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("tabMyReports").addEventListener("click", () => {
        loadDashboardData("my_reports", 1);
    });

    document.getElementById("tabFeed").addEventListener("click", () => {
        loadDashboardData("feed", 1);
    });

    loadDashboardData("my_reports", 1);
}

async function loadDashboardData(tab = "my_reports", page = 1) {
    currentTab = tab;
    currentPage = page;

    updateActiveTab();
    updateAddReportButton();

    try {
        const response = await requestAPI(`/api/report/?tab=${tab}&page=${page}`);

        if (response.status === 401) {
            alert("Sesi login habis. Silakan login ulang.");
            localStorage.removeItem("access_token");
            window.location.hash = "#login";
            return;
        }

        if (response.status !== 200) {
            console.error("Gagal mengambil data laporan");
            return;
        }

        const data = await response.json();

        renderList(data.results);
        renderPagination(data.count, page);
        await loadSummaryStats();

    } catch (error) {
        console.error(error);
    }
}

function updateActiveTab() {
    const tabMyReports = document.getElementById("tabMyReports");
    const tabFeed = document.getElementById("tabFeed");

    if (!tabMyReports || !tabFeed) return;

    if (currentTab === "my_reports") {
        tabMyReports.className = "btn btn-primary btn-sm";
        tabFeed.className = "btn btn-outline-primary btn-sm";
    } else {
        tabMyReports.className = "btn btn-outline-primary btn-sm";
        tabFeed.className = "btn btn-primary btn-sm";
    }
}

function updateAddReportButton() {
    const container = document.getElementById("addReportButtonContainer");

    if (!container) return;

    if (currentTab === "my_reports") {
        container.innerHTML = `
            <button class="btn btn-success btn-sm" id="btnAddReport">
                <i class="bi bi-plus-circle"></i>
                Tambah Laporan Baru
            </button>
        `;

        document
            .getElementById("btnAddReport")
            .addEventListener("click", openCreateModal);
    } else {
        container.innerHTML = "";
    }
}

function getProgressValue(status) {
    const progressMap = {
        DRAFT: 0,
        REPORTED: 25,
        VERIFIED: 50,
        IN_PROGRESS: 75,
        RESOLVED: 100
    };

    return progressMap[status] ?? 0;
}

function getProgressLabel(status) {
    const labelMap = {
        DRAFT: "Draft",
        REPORTED: "Diajukan",
        VERIFIED: "Terverifikasi",
        IN_PROGRESS: "Diproses",
        RESOLVED: "Selesai"
    };

    return labelMap[status] || status;
}

function getStatusBadgeClass(status) {
    const badgeMap = {
        DRAFT: "bg-secondary",
        REPORTED: "bg-warning text-dark",
        VERIFIED: "bg-primary",
        IN_PROGRESS: "bg-info text-dark",
        RESOLVED: "bg-success"
    };

    return badgeMap[status] || "bg-secondary";
}

function formatDate(dateString) {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderList(reports) {
    const container = document.getElementById("reportList");
    container.innerHTML = "";

    if (!reports || reports.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info shadow-sm">
                Belum ada laporan pada tab ini.
            </div>
        `;
        return;
    }

    reports.forEach(report => {
        const progress = getProgressValue(report.status);
        const badgeClass = getStatusBadgeClass(report.status);
        const progressLabel = getProgressLabel(report.status);

        const editButton =
            report.status === "DRAFT" && report.is_owner
                ? `
                    <button class="btn btn-warning btn-sm mt-3" onclick="editDraft(${report.id})">
                        <i class="bi bi-pencil-square"></i>
                        Edit & Ajukan Laporan
                    </button>
                `
                : "";

        container.innerHTML += `
            <div class="card report-card shadow-sm mb-3">
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                        <div>
                            <div class="report-title">${report.title}</div>
                            <p class="text-muted mb-2">${report.description}</p>
                        </div>

                        <span class="badge ${badgeClass} status-badge">
                            ${report.status}
                        </span>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="report-meta">
                                <i class="bi bi-tag"></i>
                                <strong>Kategori:</strong> ${report.category}
                            </div>

                            <div class="report-meta">
                                <i class="bi bi-geo-alt"></i>
                                <strong>Lokasi:</strong> ${report.location}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="report-meta">
                                <i class="bi bi-person"></i>
                                <strong>Pelapor:</strong> ${report.reporter}
                            </div>

                            <div class="report-meta">
                                <i class="bi bi-clock-history"></i>
                                <strong>Update:</strong> ${formatDate(report.updated_at)}
                            </div>
                        </div>
                    </div>

                    <div class="mb-1 d-flex justify-content-between">
                        <small class="fw-semibold">Progress Laporan</small>
                        <small class="text-primary fw-semibold">
                            ${progressLabel} (${progress}%)
                        </small>
                    </div>

                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width:${progress}%">
                            ${progress}%
                        </div>
                    </div>

                    ${editButton}

                </div>
            </div>
        `;
    });
}

function renderPagination(totalItems, activePage) {
    const container = document.getElementById("paginationContainer");
    container.innerHTML = "";

    const totalPages = Math.ceil(totalItems / 10);

    if (totalPages <= 1) return;

    let html = `
        <nav>
            <ul class="pagination pagination-sm justify-content-center">
    `;

    html += `
        <li class="page-item ${activePage === 1 ? "disabled" : ""}">
            <a class="page-link"
               href="#"
               onclick="loadDashboardData('${currentTab}', ${activePage - 1}); return false;">
                Sebelumnya
            </a>
        </li>
    `;

    const startPage = Math.max(1, activePage - 2);
    const endPage = Math.min(totalPages, activePage + 2);

    for (let page = startPage; page <= endPage; page++) {
        html += `
            <li class="page-item ${page === activePage ? "active" : ""}">
                <a class="page-link"
                   href="#"
                   onclick="loadDashboardData('${currentTab}', ${page}); return false;">
                    ${page}
                </a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${activePage === totalPages ? "disabled" : ""}">
            <a class="page-link"
               href="#"
               onclick="loadDashboardData('${currentTab}', ${activePage + 1}); return false;">
                Selanjutnya
            </a>
        </li>
    `;

    html += `
            </ul>
        </nav>
    `;

    container.innerHTML = html;
}

async function loadSummaryStats() {
    try {
        const response = await requestAPI(
            "/api/report/?tab=my_reports&page_size=1000"
        );

        if (response.status !== 200) return;

        const data = await response.json();
        const reports = data.results;

        const draftCount = reports.filter(
            report => report.status === "DRAFT"
        ).length;

        const reportedCount = reports.filter(
            report => report.status === "REPORTED"
        ).length;

        const verifiedCount = reports.filter(
            report => report.status === "VERIFIED"
        ).length;

        const processCount = reports.filter(
            report => report.status === "IN_PROGRESS"
        ).length;

        const doneCount = reports.filter(
            report => report.status === "RESOLVED"
        ).length;

        document.getElementById("draftCount").textContent = draftCount;
        document.getElementById("reportedCount").textContent = reportedCount;
        document.getElementById("verifiedCount").textContent = verifiedCount;
        document.getElementById("processCount").textContent = processCount;
        document.getElementById("doneCount").textContent = doneCount;

    } catch (error) {
        console.error(error);
    }
}

function openCreateModal() {
    editingReportId = null;

    document.getElementById("reportForm").reset();
    document.getElementById("reportModalTitle").textContent = "Tambah Laporan Baru";

    const modal = new bootstrap.Modal(document.getElementById("reportModal"));
    modal.show();
}

async function editDraft(id) {
    try {
        const response = await requestAPI(`/api/report/${id}/`);

        if (response.status !== 200) {
            alert("Gagal mengambil data draft.");
            return;
        }

        const report = await response.json();

        document.getElementById("title").value = report.title;
        document.getElementById("category").value = report.category;
        document.getElementById("description").value = report.description;
        document.getElementById("location").value = report.location;

        editingReportId = id;

        document.getElementById("reportModalTitle").textContent = "Edit Draft Laporan";

        const modal = new bootstrap.Modal(document.getElementById("reportModal"));
        modal.show();

    } catch (error) {
        console.error(error);
    }
}

async function submitReport(status) {
    const payload = {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        status: status
    };

    let endpoint = "/api/report/";
    let method = "POST";

    if (editingReportId !== null) {
        endpoint = `/api/report/${editingReportId}/`;
        method = "PUT";
    }

    try {
        const response = await requestAPI(endpoint, method, payload);

        if (response.status === 401) {
            alert("Sesi login habis. Silakan login ulang.");
            localStorage.removeItem("access_token");
            window.location.hash = "#login";
            return;
        }

        if (response.status === 200 || response.status === 201) {
            const modalElement = document.getElementById("reportModal");
            const modal = bootstrap.Modal.getInstance(modalElement);

            modal.hide();

            document.getElementById("reportForm").reset();
            editingReportId = null;

            loadDashboardData(currentTab, currentPage);
        } else {
            const errorData = await response.json();
            console.error(errorData);
            alert("Gagal menyimpan laporan. Cek Console.");
        }

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    updateNavbar();

    document.getElementById("btnSaveDraft")?.addEventListener("click", () => {
        submitReport("DRAFT");
    });

    document.getElementById("btnSubmitReport")?.addEventListener("click", () => {
        submitReport("REPORTED");
    });

});

document.addEventListener("click", function (event) {

    if (event.target.closest("#btnLogout")) {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        updateNavbar();

        window.location.hash = "#login";
    }

});