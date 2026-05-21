from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AgeViewSet,
    AvatarViewSet,
    BioViewSet,
    CityViewSet,
    CountryViewSet,
    FirstNameViewSet,
    GameViewSet,
    GenderViewSet,
    LastNameViewSet,
    ProfilesViewSet,
)

router = DefaultRouter()
router.register(r"firstname", FirstNameViewSet)
router.register(r"lastname", LastNameViewSet)
router.register(r"bio", BioViewSet)
router.register(r"age", AgeViewSet)
router.register(r"city", CityViewSet)
router.register(r"country", CountryViewSet)
router.register(r"gender", GenderViewSet)
router.register(r"avatar", AvatarViewSet)
router.register(r"game", GameViewSet)
router.register(r"profiles", ProfilesViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
