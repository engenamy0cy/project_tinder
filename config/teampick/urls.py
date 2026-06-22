from django.urls import path

from .views import (
    LikesReceivedView,
    LikesSentView,
    MatchesView,
    MessagesView,
    SearchView,
)

urlpatterns = [
    path("search/", SearchView.as_view(), name="search"),
    path("matches/", MatchesView.as_view(), name="matches"),
    path("messages/", MessagesView.as_view(), name="messages"),
    path("likes/", LikesSentView.as_view(), name="likes"),
    path("likes/received/", LikesReceivedView.as_view(), name="likes-received"),
]
