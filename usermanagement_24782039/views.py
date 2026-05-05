from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from .forms import CustomUserCreationForm


def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = False
            user.is_member = True
            user.save()
            messages.success(request, 'Registrasi berhasil. Silakan login.')
            return redirect('login')
    else:
        form = CustomUserCreationForm()

    return render(request, 'usermanagement_24782039/register.html', {'form': form})


class CustomLoginView(LoginView):
    template_name = 'usermanagement_24782039/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, 'Login berhasil.')
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('home_page')


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('login')

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, 'Logout berhasil.')
        return super().dispatch(request, *args, **kwargs)