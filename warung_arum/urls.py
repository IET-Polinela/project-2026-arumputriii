from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_app.urls')),
    path('', include('usermanagement_24782039.urls')),
    path('', include('dashboard_24782039.urls')),
]