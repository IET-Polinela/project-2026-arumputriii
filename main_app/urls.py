from django.urls import path

from .views import (
    BarangCreateView,
    BarangDeleteView,
    BarangDetailJsonView,
    BarangDetailView,
    BarangListView,
    BarangSearchJsonView,
    BarangUpdateView,
)


urlpatterns = [
    path('', BarangListView.as_view(), name='barang_list'),
    path('barang/<int:pk>/', BarangDetailView.as_view(), name='barang_detail'),
    path('barang/tambah/', BarangCreateView.as_view(), name='barang_create'),
    path('barang/<int:pk>/edit/', BarangUpdateView.as_view(), name='barang_update'),
    path('barang/<int:pk>/hapus/', BarangDeleteView.as_view(), name='barang_delete'),

    path('api/barang/search/', BarangSearchJsonView.as_view(), name='barang_search_json'),
    path('api/barang/<int:pk>/', BarangDetailJsonView.as_view(), name='barang_detail_json'),
]