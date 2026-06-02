from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, register, login

router = DefaultRouter()
router.register(r"user", UserViewSet)

urlpatterns = [
    path("users/user/register/", register),
    path("users/user/login/", login),

    # если router нужен — оставляем, но он НЕ для auth
    path("", include(router.urls)),
]