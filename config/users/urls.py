from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import EmailViewSet, Is_VerifedViewSet, Is_OnlineViewSet, Created_atViewSet, Updated_atViewSet, Last_activiryViewSet, UserViewSet

router = DefaultRouter()
router.register(r'email',EmailViewSet)
router.register(r'is_verifed', Is_VerifedViewSet)
router.register(r'is_online', Is_OnlineViewSet)
router.register(r'created_at',Created_atViewSet)
router.register(r'updated_at',Updated_atViewSet)
router.register(r'last_activity',Last_activiryViewSet)
router.register(r'user',UserViewSet)

urlpatterns = [
    path('', include(router.urls))]