from django.urls import path

from .views import CustomLoginView, CustomLogoutView, StaffRegisterView


urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('register/', StaffRegisterView.as_view(), name='register'),
]