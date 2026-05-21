from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models
from django.utils import timezone


class Is_verified(models.Model):
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return str(self.is_verified)


class Is_online(models.Model):
    is_online = models.BooleanField(default=True)

    def __str__(self):
        return str(self.is_online)


class Last_activity(models.Model):
    last_activity = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.last_activity)


class UserManager(DjangoUserManager):
    def _attach_status(self, user, *, update_activity=False):
        if user.is_verified_id is None:
            user.is_verified = Is_verified.objects.create(is_verified=True)
        if user.is_online_id is None:
            user.is_online = Is_online.objects.create(is_online=True)
        if user.last_activity_id is None:
            user.last_activity = Last_activity.objects.create(last_activity=timezone.now())
        elif update_activity:
            user.last_activity.last_activity = timezone.now()
            user.last_activity.save(update_fields=["last_activity"])
        user.save(
            update_fields=["is_verified", "is_online", "last_activity"]
        )

    def create_user(self, username, email=None, password=None, **extra_fields):
        user = super().create_user(username, email=email, password=password, **extra_fields)
        self._attach_status(user)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        user = super().create_superuser(
            username, email=email, password=password, **extra_fields
        )
        self._attach_status(user)
        return user


class User(AbstractUser):
    """Учётная запись: username, email, password (+ служебные флаги)."""

    email = models.EmailField(unique=True)
    is_verified = models.ForeignKey(
        Is_verified,
        on_delete=models.PROTECT,
        verbose_name="Проверено",
        null=True,
        blank=True,
    )
    is_online = models.ForeignKey(
        Is_online,
        on_delete=models.PROTECT,
        verbose_name="Онлайн",
        null=True,
        blank=True,
    )
    last_activity = models.ForeignKey(
        Last_activity,
        on_delete=models.PROTECT,
        verbose_name="Последняя активность",
        null=True,
        blank=True,
    )

    objects = UserManager()
    REQUIRED_FIELDS = ["email"]

    def touch_activity(self):
        """Обновить время последней активности на «сейчас»."""
        if self.last_activity_id is None:
            self.last_activity = Last_activity.objects.create(last_activity=timezone.now())
        else:
            self.last_activity.last_activity = timezone.now()
            self.last_activity.save(update_fields=["last_activity"])
        self.save(update_fields=["last_activity"])

    def __str__(self):
        return self.username
