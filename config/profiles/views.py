from rest_framework import viewsets
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
    ProfilesSerializer,
)
from .services import ProfileSelectionService


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


class ProfilesViewSet(viewsets.ModelViewSet):
    queryset = Profiles.objects.all()
    serializer_class = ProfilesSerializer

    @action(detail=False, methods=["get"])
    def feed(self, request):
        user_id = request.query_params.get("user_id")
        games = request.query_params.getlist("game")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)
        profiles = ProfileSelectionService.get_feed_for_user(
            int(user_id), game_codes=games or None
        )
        return Response(ProfilesSerializer(profiles, many=True).data)
