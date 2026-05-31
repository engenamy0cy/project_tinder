from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Age,
    Avatar,
    Bio,
    City,
    Country,
    FirstName,
    Game,
    Gender,
    LastName,
    Profiles,
)
from .profile_payload import ensure_default_games, profile_to_card
from .profile_upsert import upsert_profile
from .serializers import (
    AgeSerializer,
    AvatarSerializer,
    BioSerializer,
    CitySerializer,
    CountrySerializer,
    FirstNameSerializer,
    GameSerializer,
    GenderSerializer,
    LastNameSerializer,
    ProfileWriteSerializer,
    ProfilesSerializer,
)
from .services import ProfileSelectionService


def _profile_queryset():
    return Profiles.objects.select_related(
        "user",
        "first_name",
        "last_name",
        "bio",
        "age",
        "gender",
        "hours_in_game",
        "city",
        "country",
        "main_game",
        "avatar",
    ).prefetch_related("games")


class FirstNameViewSet(viewsets.ModelViewSet):
    queryset = FirstName.objects.all()
    serializer_class = FirstNameSerializer


class LastNameViewSet(viewsets.ModelViewSet):
    queryset = LastName.objects.all()
    serializer_class = LastNameSerializer


class BioViewSet(viewsets.ModelViewSet):
    queryset = Bio.objects.all()
    serializer_class = BioSerializer


class AgeViewSet(viewsets.ModelViewSet):
    queryset = Age.objects.all()
    serializer_class = AgeSerializer


class GenderViewSet(viewsets.ModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class AvatarViewSet(viewsets.ModelViewSet):
    queryset = Avatar.objects.all()
    serializer_class = AvatarSerializer


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
            return Response({"detail": "profile not found"}, status=404)
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
        games = request.query_params.getlist("game")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)
        from tinder.services import SearchService

        cards = SearchService.search(
            int(user_id),
            game=games[0] if games else None,
        )
        return Response({"results": cards, "count": len(cards)})
