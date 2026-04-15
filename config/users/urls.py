from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import EmailViewSet, Is_VerifedViewSet, Is_OnlineViewSet, Created_atViewSet, Updated_atViewSet, Last_activiryViewSet

router = DefaultRouter()
router.register(r'firstname',EmailViewSet)
router.register(r'lastname', Is_VerifedViewSet)
router.register(r'age', Is_OnlineViewSet)
router.register(r'city',Created_atViewSet)
router.register(r'country',Updated_atViewSet)
router.register(r'gender',Last_activiryViewSet)

urlpatterns = [
    path('', include(router.urls))]