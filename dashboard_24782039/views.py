from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum
from django.http import JsonResponse
from django.views import View
from django.views.generic import TemplateView

from main_app.models import Barang


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard_24782039/dashboard.html'


class DashboardDataView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        stok_per_kategori = (
            Barang.objects
            .values('kategori')
            .annotate(total_stok=Sum('stok'))
            .order_by('kategori')
        )

        data = [
            {
                'kategori': item['kategori'],
                'total_stok': item['total_stok'] or 0,
            }
            for item in stok_per_kategori
        ]

        return JsonResponse({
            'stok_per_kategori': data
        })