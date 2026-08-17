"""
URL configuration for config project.
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse, FileResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

def serve_spa(request):
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_file):
        return FileResponse(open(index_file, "rb"), content_type="text/html")
    return HttpResponse("Frontend build in progress...", content_type="text/plain", status=200)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("tasks.urls")),

    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    re_path(r"^(?!api/|admin/|static/|assets/).*$", serve_spa, name="spa"),
]