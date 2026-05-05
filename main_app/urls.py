from django.urls import path
from .views import (
    HomePageView,
    ReportListView,
    ReportDetailView,
    ReportCreateView,
    ReportUpdateView,
    ReportDeleteView,
    ReportUpdateStatusView,
    live_search_reports,
    report_detail_api,
)

urlpatterns = [
    path('', HomePageView.as_view(), name='home_page'),
    path('reports/', ReportListView.as_view(), name='report_list'),
    path('report/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('report/add/', ReportCreateView.as_view(), name='report_add'),
    path('report/<int:pk>/edit/', ReportUpdateView.as_view(), name='report_edit'),
    path('report/<int:pk>/delete/', ReportDeleteView.as_view(), name='report_delete'),
    path('report/<int:pk>/update-status/', ReportUpdateStatusView.as_view(), name='report_update_status'),

    path('reports/search/', live_search_reports, name='live_search_reports'),
    path('reports/detail/<int:pk>/', report_detail_api, name='report_detail_api'),
]