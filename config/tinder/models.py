# tinder/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Добавляйте свои дополнительные поля
    bio = models.TextField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Если нужно изменить related_name для groups и user_permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='tinder_customuser_set',  # Уникальное имя
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='tinder_customuser_permissions_set',
        blank=True,
    )
    
    class Meta:
        db_table = 'tinder_customuser'
    
    def __str__(self):
        return self.email