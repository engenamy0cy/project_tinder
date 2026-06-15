from rest_framework import serializers
from .models import Game, Profiles
from .profile_payload import profile_to_card

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"

class ProfileCardSerializer(serializers.Serializer):
    """Плоская карточка — то же, что отдаёт /tinder/search/."""
    def to_representation(self, instance):
        return profile_to_card(instance)

class ProfileWriteSerializer(serializers.ModelSerializer):
    game = serializers.CharField(required=False, write_only=True)
    extra_games = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Profiles
        fields = (
            "first_name",
            "last_name",
            "bio",
            "age",
            "hours_in_game",
            "gender",
            "city",
            "country",
            "avatar",
            "game",
            "extra_games",
        )

class ProfilesSerializer(serializers.ModelSerializer):
    card = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = "__all__"

    def get_card(self, obj):
        return profile_to_card(obj)
