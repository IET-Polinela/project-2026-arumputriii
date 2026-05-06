from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'is_staff',
        'is_superuser',
        'is_owner',
        'is_staff_member',
    )

    list_filter = (
        'is_staff',
        'is_superuser',
        'is_owner',
        'is_staff_member',
    )

    fieldsets = UserAdmin.fieldsets + (
        ('Role Warung', {
            'fields': ('is_owner', 'is_staff_member')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Warung', {
            'fields': ('is_owner', 'is_staff_member')
        }),
    )


admin.site.register(CustomUser, CustomUserAdmin)