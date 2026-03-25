from django.urls import path
from .views import ProfileListView, ProfileCreateView, ProfileDetailView, ProfileMeView

urlpatterns = [
    path("profiles/", ProfileListView.as_view()),
    path("profiles/create/", ProfileCreateView.as_view()),
    path("profiles/<int:pk>/", ProfileDetailView.as_view()),
    path("profiles/me/", ProfileMeView.as_view()),
]