from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.views.generic import ListView

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