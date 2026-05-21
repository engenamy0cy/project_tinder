from django.urls import path

from .views import MatchesView, SearchView

urlpatterns = [
    path("search/", SearchView.as_view(), name="search"),
    path("matches/", MatchesView.as_view(), name="matches"),
]
