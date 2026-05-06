from django.contrib import admin
from .models import Barang


@admin.register(Barang)
class BarangAdmin(admin.ModelAdmin):
    list_display = ('nama', 'kategori', 'harga_beli', 'stok')
    list_filter = ('kategori',)
    search_fields = ('nama', 'kategori')