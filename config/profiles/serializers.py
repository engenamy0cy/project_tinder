from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):

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