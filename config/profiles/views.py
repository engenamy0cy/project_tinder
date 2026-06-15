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
        ser = ProfileWriteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        card = upsert_profile(int(user_id), ser.validated_data)
        return Response(card)

    @action(detail=False, methods=["get"])
    def feed(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)

        # Simple feed logic if SearchService is missing or complex
        try:
            from teampick.services import SearchService
            games = request.query_params.getlist("game")
            cards = SearchService.search(
                int(user_id),
                game=games[0] if games else None,
            )
        except (ImportError, AttributeError):
            # Fallback: all profiles except current user
            profiles = _profile_queryset().exclude(user_id=user_id)
            cards = [profile_to_card(p) for p in profiles]

        return Response({"results": cards, "count": len(cards)})
