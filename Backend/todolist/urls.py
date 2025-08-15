from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework.routers import DefaultRouter
from core.views import TaskViewSet, CategoryViewSet, ContextViewSet
from .views import home

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"context", ContextViewSet, basename="context")

'''def home(_request):
    return HttpResponse(
        "<h1>Smart Todo API</h1>"
        "<p>Backend is running.</p>"
        '<p>Try <a href="/api/">/api/</a> or <a href="/admin/">/admin/</a>.</p>',
        content_type="text/html"
    )
'''

urlpatterns = [
    path("", home),                 # <-- root page
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
