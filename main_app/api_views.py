from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_admin:
            return Report.objects.all().order_by('-created_at')

        return Report.objects.filter(
            Q(status__in=['REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED']) |
            Q(status='DRAFT', reporter=user)
        ).order_by('-created_at')

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)