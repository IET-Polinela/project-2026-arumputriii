from django.urls import path

from .views import DashboardDataView, DashboardView


urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/data/', DashboardDataView.as_view(), name='dashboard_data'),
]