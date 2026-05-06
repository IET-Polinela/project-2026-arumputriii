from django.urls import path

from .views import BarangListView


urlpatterns = [
    path('', BarangListView.as_view(), name='barang_list'),
]