from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, ProfilesViewSet

router = DefaultRouter()
router.register(r"game", GameViewSet)
router.register(r"profiles", ProfilesViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
