from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models
from django.utils import timezone

class UserManager(DjangoUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('is_online', True)
        extra_fields.setdefault('last_activity', timezone.now())
        return super().create_user(username, email=email, password=password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('is_online', True)
        extra_fields.setdefault('last_activity', timezone.now())
        return super().create_superuser(username, email=email, password=password, **extra_fields)

class User(AbstractUser):
    """Учётная запись: username, email, password (+ служебные флаги)."""
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=True, verbose_name="Проверено")
    is_online = models.BooleanField(default=True, verbose_name="Онлайн")
    last_activity = models.DateTimeField(default=timezone.now, verbose_name="Последняя активность")

    objects = UserManager()
    REQUIRED_FIELDS = ["email"]

    def touch_activity(self):
        """Обновить время последней активности на «сейчас»."""
        self.last_activity = timezone.now()
        self.save(update_fields=["last_activity"])

    def __str__(self):
        return self.username
