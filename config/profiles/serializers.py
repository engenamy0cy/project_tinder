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


class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = "__all__"
