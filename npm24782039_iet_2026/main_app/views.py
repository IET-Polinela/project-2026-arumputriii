from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import CreateView, DeleteView, DetailView, ListView, TemplateView, UpdateView

from .forms import ReportForm
from .models import Report


class AdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, 'Akses Ditolak: Anda bukan admin.')
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)


class HomePageView(TemplateView):
    template_name = 'main_app/home.html'


class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'
    ordering = ['-created_at']


class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'


class ReportCreateView(AdminRequiredMixin, CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil ditambahkan.')
        return super().form_valid(form)


class ReportUpdateView(AdminRequiredMixin, UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil diperbarui.')
        return super().form_valid(form)


class ReportDeleteView(AdminRequiredMixin, DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil dihapus.')
        return super().form_valid(form)


class ReportUpdateStatusView(AdminRequiredMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)

        if report.status == 'REPORTED':
            report.status = 'VERIFIED'
            messages.success(request, 'Status laporan berhasil diubah ke VERIFIED.')
        elif report.status == 'VERIFIED':
            report.status = 'IN_PROGRESS'
            messages.success(request, 'Status laporan berhasil diubah ke IN PROGRESS.')
        elif report.status == 'IN_PROGRESS':
            report.status = 'RESOLVED'
            messages.success(request, 'Status laporan berhasil diubah ke RESOLVED.')
        else:
            messages.warning(request, 'Status laporan sudah final dan tidak dapat diubah lagi.')
            return redirect('report_list')

        report.save()
        return redirect('report_list')