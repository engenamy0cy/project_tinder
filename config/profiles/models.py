from django.contrib.auth import get_user_model
from django.db import models

class FirstName (models.Model):
    first_name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class LastName (models.Model):
    last_name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name
    
class Bio (models.Model):
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
class Age (models.Model):
    age = models.IntegerField()

    def __str__(self):
        return self.name
    
class Gender (models.Model):
    gender = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
class City (models.Model):
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Country (models.Model):
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Avatar (models.Model):
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.name
    
class Created_at (models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Updated_at (models.Model):
    updated_at = models.DateTimeField(auto_now=True)

class Profiles(models.Model):
    first_name = models.ForeignKey(FirstName, on_delete=models.PROTECT verbose_name="цвет",related_name="cars",null=True)
    last_name = models.ForeignKey(LastName, on_delete=models.PROTECT verbose_name="цвет",related_name="cars",null=True)
    bio = models.ForeignKey(Bio, on_delete=models.PROTECT verbose_name="цвет",related_name="cars",null=True)
    age = models.ForeignKey(Age, on_delete=models.PROTECT verbose_name="цвет",related_name="cars",null=True)
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE verbose_name="цвет",related_name="cars",null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE verbose_name="цвет",related_name="cars",null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE verbose_name="цвет",related_name="cars",null=True)
    avatar = models.ForeignKey(Avatar, on_delete=models.PROTECT verbose_name="цвет",related_name="cars",null=True)
    created_at = models.ForeignKey(auto_now_add=True)
    updated_at = models.ForeignKey(auto_now=True)


    def __str__(self):
        return self.name