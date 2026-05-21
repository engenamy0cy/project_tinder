from django.utils import timezone

from users.models import Last_activity, User


class UserStatusService:
    @staticmethod
    def touch_activity(user_id: int) -> None:
        user = User.objects.select_related("last_activity").get(pk=user_id)
        user.touch_activity()

    @staticmethod
    def get_status_payload(user: User) -> dict:
        return {
            "is_verified": bool(user.is_verified and user.is_verified.is_verified),
            "is_online": bool(user.is_online and user.is_online.is_online),
            "last_activity": (
                user.last_activity.last_activity.isoformat()
                if user.last_activity and user.last_activity.last_activity
                else timezone.now().isoformat()
            ),
        }
