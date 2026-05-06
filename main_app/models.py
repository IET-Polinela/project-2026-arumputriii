from django.db import models


KATEGORI_CHOICES = [
    ('MAKANAN', 'Makanan'),
    ('MINUMAN', 'Minuman'),
    ('SEMBAKO', 'Sembako'),
    ('PERALATAN', 'Peralatan'),
    ('LAINNYA', 'Lainnya'),
]


class Barang(models.Model):
    nama = models.CharField(max_length=200)
    kategori = models.CharField(max_length=30, choices=KATEGORI_CHOICES)
    harga_beli = models.PositiveIntegerField()
    stok = models.PositiveIntegerField()

    def __str__(self):
        return self.nama