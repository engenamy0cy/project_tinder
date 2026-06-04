from django.utils import timezone
from users.models import User

class UserStatusService:
    @staticmethod
    def touch_activity(user_id: int) -> None:
        user = User.objects.get(pk=user_id)
        user.touch_activity()

    @staticmethod
    def get_status_payload(user: User) -> dict:
        return {
            "is_verified": user.is_verified,
            "is_online": user.is_online,
            "last_activity": (
                user.last_activity.isoformat()
                if user.last_activity
                else timezone.now().isoformat()
            ),
        }
