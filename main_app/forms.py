from django import forms

from .models import Barang


class BarangForm(forms.ModelForm):
    class Meta:
        model = Barang
        fields = [
            'nama',
            'kategori',
            'harga_beli',
            'stok',
        ]

        widgets = {
            'nama': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Contoh: Indomie Goreng'
            }),
            'kategori': forms.Select(attrs={
                'class': 'form-select'
            }),
            'harga_beli': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Contoh: 3500',
                'min': 0
            }),
            'stok': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Contoh: 50',
                'min': 0
            }),
        }