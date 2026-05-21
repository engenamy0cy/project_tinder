from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Is_online, Is_verified, Last_activity, User


@receiver(post_save, sender=User)
def ensure_user_status(sender, instance, created, **kwargs):
    """Подставляет служебные поля, если их ещё нет."""
    changed = False
    if instance.is_verified_id is None:
        instance.is_verified = Is_verified.objects.create(is_verified=True)
        changed = True
    if instance.is_online_id is None:
        instance.is_online = Is_online.objects.create(is_online=True)
        changed = True
    if instance.last_activity_id is None:
        instance.last_activity = Last_activity.objects.create(last_activity=timezone.now())
        changed = True
    if changed:
        User.objects.filter(pk=instance.pk).update(
            is_verified=instance.is_verified,
            is_online=instance.is_online,
            last_activity=instance.last_activity,
        )
