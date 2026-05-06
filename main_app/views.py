from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    ListView,
    UpdateView,
)

from .forms import BarangForm
from .models import Barang


class OwnerRequiredMixin(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, 'Silakan login terlebih dahulu.')
            return redirect('login')

        if not request.user.is_owner:
            messages.error(
                request,
                'Akses ditolak. Fitur ini hanya dapat diakses oleh Owner.'
            )
            return redirect('barang_list')

        return super().dispatch(request, *args, **kwargs)


class BarangListView(LoginRequiredMixin, ListView):
    model = Barang
    template_name = 'main_app/barang_list.html'
    context_object_name = 'barangs'
    ordering = ['nama']


class BarangDetailView(LoginRequiredMixin, DetailView):
    model = Barang
    template_name = 'main_app/barang_detail.html'
    context_object_name = 'barang'


class BarangCreateView(OwnerRequiredMixin, CreateView):
    model = Barang
    form_class = BarangForm
    template_name = 'main_app/barang_form.html'
    success_url = reverse_lazy('barang_list')

    def form_valid(self, form):
        messages.success(self.request, 'Barang berhasil ditambahkan.')
        return super().form_valid(form)


class BarangUpdateView(OwnerRequiredMixin, UpdateView):
    model = Barang
    form_class = BarangForm
    template_name = 'main_app/barang_form.html'
    success_url = reverse_lazy('barang_list')

    def form_valid(self, form):
        messages.success(self.request, 'Barang berhasil diperbarui.')
        return super().form_valid(form)


class BarangDeleteView(OwnerRequiredMixin, DeleteView):
    model = Barang
    template_name = 'main_app/barang_confirm_delete.html'
    success_url = reverse_lazy('barang_list')

    def form_valid(self, form):
        messages.success(self.request, 'Barang berhasil dihapus.')
        return super().form_valid(form)