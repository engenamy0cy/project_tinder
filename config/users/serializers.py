from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    is_verified_flag = serializers.SerializerMethodField()
    is_online_flag = serializers.SerializerMethodField()
    last_activity_at = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_verified_flag",
            "is_online_flag",
            "last_activity_at",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def get_is_verified_flag(self, obj):
        return bool(obj.is_verified and obj.is_verified.is_verified)

    def get_is_online_flag(self, obj):
        return bool(obj.is_online and obj.is_online.is_online)

    def get_last_activity_at(self, obj):
        if obj.last_activity and obj.last_activity.last_activity:
            return obj.last_activity.last_activity.isoformat()
        return None
