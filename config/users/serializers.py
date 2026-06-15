from django.contrib.auth import get_user_model
from rest_framework import serializers

from profiles.models import Game
from profiles.profile_payload import ensure_default_games

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_verified",
            "is_online",
            "last_activity",
        )
        read_only_fields = ("is_verified", "is_online", "last_activity")


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=False, allow_blank=True)
    game = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name", "game")

    def create(self, validated_data):
        game_code = validated_data.pop("game", None) or None
        profile_first_name = validated_data.pop("first_name", None) or None
        user = User.objects.create_user(**validated_data)

        profile = user.profile
        if profile_first_name:
            profile.first_name = profile_first_name
        if game_code:
            ensure_default_games()
            game_obj, _ = Game.objects.get_or_create(game=game_code)
            profile.main_game = game_obj
        if profile_first_name or game_code:
            profile.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
