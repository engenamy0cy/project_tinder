from django.db.models.signals import post_save
from django.dispatch import receiver

from profiles.models import Profiles

from .models import User


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profiles.objects.get_or_create(user=instance)
