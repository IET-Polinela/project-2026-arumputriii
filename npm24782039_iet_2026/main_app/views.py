from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.views import View
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages

from .models import Report
from .forms import ReportForm


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


class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan.")
        return super().form_valid(form)


class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui.")
        return super().form_valid(form)


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dihapus.")
        return super().form_valid(form)


class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)

        if report.status == 'REPORTED':
            report.status = 'VERIFIED'
            messages.success(request, "Status laporan berhasil diubah ke VERIFIED.")
        elif report.status == 'VERIFIED':
            report.status = 'IN_PROGRESS'
            messages.success(request, "Status laporan berhasil diubah ke IN PROGRESS.")
        elif report.status == 'IN_PROGRESS':
            report.status = 'RESOLVED'
            messages.success(request, "Status laporan berhasil diubah ke RESOLVED.")
        else:
            messages.warning(request, "Status laporan sudah final dan tidak dapat diubah lagi.")
            return redirect('report_list')

        report.save()
        return redirect('report_list')