from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, login, register

router = DefaultRouter()
router.register(r"user", UserViewSet, basename="user")

urlpatterns = [
    path("user/register/", register, name="user-register"),
    path("user/login/", login, name="user-login"),
    path("", include(router.urls)),
]
