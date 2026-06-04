from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import User

@receiver(post_save, sender=User)
def ensure_user_status(sender, instance, created, **kwargs):
    """Подставляет служебные поля, если их ещё нет."""
    if created:
        # Default values are already set in the model, but we can ensure them here if needed.
        pass
