from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, register, login

router = DefaultRouter()
router.register(r"user", UserViewSet)

urlpatterns = [
    path("register/", register),
    path("login/", login),
    path("", include(router.urls)),
]
