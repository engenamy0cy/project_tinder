from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import FirstNameViewSet, LastNameViewSet, AgeViewSet, CityViewSet, CountryViewSet,GenderViewSet, AvatarViewSet, ProfilesViewSet

router = DefaultRouter()
router.register(r'firstname',FirstNameViewSet)
router.register(r'lastname', LastNameViewSet)
router.register(r'age', AgeViewSet)
router.register(r'city',CityViewSet)
router.register(r'country',CountryViewSet)
router.register(r'gender',GenderViewSet)
router.register(r'avatar',AvatarViewSet)
router.register(r'profiles',ProfilesViewSet)

urlpatterns = [
    path('', include(router.urls))
]