from rest_framework import serializers

from .models import (
    Age,
    Avatar,
    Bio,
    City,
    Country,
    FirstName,
    Game,
    Gender,
    Hours_in_game,
    LastName,
    Profiles,
)
from .profile_payload import profile_to_card


class FirstNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirstName
        fields = "__all__"


class LastNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LastName
        fields = "__all__"


class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = "__all__"


class AgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Age
        fields = "__all__"


class HoursInGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hours_in_game
        fields = "__all__"


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = "__all__"


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class ProfileCardSerializer(serializers.Serializer):
    """Плоская карточка — то же, что отдаёт /tinder/search/."""

    def to_representation(self, instance):
        return profile_to_card(instance)


class ProfileWriteSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    hours_in_game = serializers.IntegerField(required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=["Man", "Woman", "dont_indicate"], required=False
    )
    city = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    game = serializers.ChoiceField(
        choices=["dota2", "cs2", "majestic"], required=False
    )
    games = serializers.ListField(
        child=serializers.ChoiceField(choices=["dota2", "cs2", "majestic"]),
        required=False,
    )


class ProfilesSerializer(serializers.ModelSerializer):
    """Совместимость с админкой; для API списка используйте ProfileCardSerializer."""

    card = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = "__all__"

    def get_card(self, obj):
        return profile_to_card(obj)
