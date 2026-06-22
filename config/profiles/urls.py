from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, ProfilesViewSet, serve_avatar

router = DefaultRouter()
router.register(r"game", GameViewSet)
router.register(r"profiles", ProfilesViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("avatar/<int:user_id>/", serve_avatar, name="serve-avatar"),
]
