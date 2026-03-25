from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    # Mobile client doesn't choose user; backend sets it from auth token.
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "user",
            "first_name",
            "last_name",
            "bio",
            "age",
            "gender",
            "city",
            "country",
            "avatar",
            "created_at",
            "updated_at",
        )