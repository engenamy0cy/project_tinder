from django.urls import path
from .views import ProfileListView, ProfileCreateView, ProfileDetailView, ProfileMeView

urlpatterns = [
    path("profiles/", ProfileListView),
    path("profiles/create/", ProfileCreateView),
    path("profiles/<int:pk>/", ProfileDetailView),
]