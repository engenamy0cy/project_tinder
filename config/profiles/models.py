from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from users.models import User

class FirstName(models.Model):
    first_name = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name

class LastName(models.Model):
    last_name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.last_name
    
class Bio(models.Model):
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.bio
    
class Age(models.Model):
    age = models.IntegerField()
    
    def __int__(self):
        return self.age
    
class Gender(models.Model):
    GEN = [
        ("Мужской","Man"),
        ("Женский","Woman"),
        ("Средний","don't indicate")
    ]
    status_gen = models.CharField(max_length=20, choices=GEN, default=" ")

    def __str__(self):
        return self.status_gen
    
class City(models.Model):
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.city
    
class Country(models.Model):
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.country
    
class Avatar(models.Model):
    avatar = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        if self.avatar:
            return self.avatar.name
        return "None"

class Profiles(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    first_name = models.ForeignKey(FirstName, on_delete=models.PROTECT, verbose_name="Имя",null=True)
    last_name = models.ForeignKey(LastName, on_delete=models.PROTECT, verbose_name="Фамилия",null=True)
    bio = models.ForeignKey(Bio, on_delete=models.PROTECT, verbose_name="Биография",null=True)
    age = models.ForeignKey(Age, on_delete=models.PROTECT, verbose_name="Возраст",null=True)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE, verbose_name="Пол",null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, verbose_name="Город",null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name="Страна",null=True)
    avatar = models.ForeignKey(Avatar, on_delete=models.PROTECT, verbose_name="Аватар",null=True)

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name.first_name} {self.last_name.last_name}"
        return f"Profile {self.id}"
