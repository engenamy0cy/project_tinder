import base64
from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game, Profiles
from .profile_payload import ensure_default_games, profile_to_card
from .profile_upsert import upsert_profile
from .serializers import (
    GameSerializer,
    ProfileWriteSerializer,
    ProfilesSerializer,
)

def _profile_queryset():
    return Profiles.objects.select_related(
        "user",
        "main_game",
    ).prefetch_related("games")

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def list(self, request, *args, **kwargs):
        ensure_default_games()
        return super().list(request, *args, **kwargs)

class ProfilesViewSet(viewsets.ModelViewSet):
    queryset = _profile_queryset()
    serializer_class = ProfilesSerializer

    def list(self, request, *args, **kwargs):
        profiles = self.get_queryset()
        return Response([profile_to_card(p) for p in profiles])

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()
        return Response(profile_to_card(profile))

    @action(detail=False, methods=["get"])
    def me(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)
        profile = _profile_queryset().filter(user_id=int(user_id)).first()
        if not profile:
            # Create a blank profile if it doesn't exist
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.filter(id=user_id).first()
            if not user:
                return Response({"detail": "user not found"}, status=404)
            profile = Profiles.objects.create(user=user)
        return Response(profile_to_card(profile))

    @action(detail=False, methods=["post", "put", "patch"])
    def save(self, request):
        user_id = request.data.get("user_id") or request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)
        card = upsert_profile(int(user_id), request.data)
        return Response(card)

    @action(detail=False, methods=["get"])
    def feed(self, request):
        user_id = request.query_params.get("user_id")

        try:
            from teampick.services import SearchService
            games = request.query_params.getlist("game")
            if user_id:
                cards = SearchService.search(
                    int(user_id),
                    game=games[0] if games else None,
                )
            else:
                profiles = _profile_queryset()
                if games:
                    from django.db.models import Q
                    profiles = profiles.filter(
                        Q(main_game__game=games[0]) | Q(games__game=games[0])
                    ).distinct()
                cards = [profile_to_card(p) for p in profiles[:20]]
        except (ImportError, AttributeError):
            profiles = _profile_queryset()
            if user_id:
                profiles = profiles.exclude(user_id=user_id)
            cards = [profile_to_card(p) for p in profiles[:20]]

        return Response({"results": cards, "count": len(cards)})


def serve_avatar(request, user_id: int):
    from .models import Profiles
    profile = (
        Profiles.objects.filter(user_id=user_id)
        .select_related("user", "main_game")
        .prefetch_related("games")
        .first()
    )
    if not profile or not profile.avatar_data:
        return HttpResponse(status=404)
    try:
        raw = profile.avatar_data
        if ";base64," in raw:
            raw = raw.split(";base64,", 1)[1]
        img_data = base64.b64decode(raw)
        ext = profile.avatar_data.split(";")[0].split("/")[-1] if "/" in profile.avatar_data else "png"
        return HttpResponse(img_data, content_type=f"image/{ext}")
    except Exception:
        return HttpResponse(status=404)
