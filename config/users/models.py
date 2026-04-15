from django.contrib.auth.models import AbstractUser
from django.db import models

class Email(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Is_verifed(models.Model):
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Is_online(models.Model):
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Created_at(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Updated_at(models.Model):
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Last_activity(models.Model):
    last_activity = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    email = models.ForeignKey(Email, on_delete=models.PROTECT, verbose_name="Email",null=True)
    is_verified = models.ForeignKey(Is_verifed, on_delete=models.PROTECT, verbose_name="Проверено",null=True)
    is_online = models.ForeignKey(Is_online, on_delete=models.PROTECT, verbose_name="Онлайн",null=True)
    created_at = models.ForeignKey(Created_at, on_delete=models.PROTECT, verbose_name="Создано в",null=True)
    updated_at = models.ForeignKey(Updated_at, on_delete=models.PROTECT, verbose_name="Обновлено в",null=True)
    last_activity = models.ForeignKey(Last_activity, on_delete=models.PROTECT, verbose_name="Последняя активность",null=True)

    def __str__(self):
        return self.username