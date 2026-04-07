from rest_framework import serializers
from .models import Profile, Gender, FirstName, LastName, Bio, Age, Avatar, City, Country

class ProfileSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "user",
            "first_name",
            "last_name",
            "bio",
            "age",
            "gender",
            "city",
            "country"
        )

class FirstNameSerializers (serializers.ModelSerializer):
    class Meta:
        model = FirstName
        fields = '__all__'

class LastNameSerializers (serializers.ModelSerializer):
    class Meta:
        model = LastName
        fields = '__all__'
    
class BioSerializers (serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = '__all__'
    
class AgeSerializers (serializers.ModelSerializer):
    class Meta:
        model = Age
        fields = '__all__'
    
class GenderSerializers (serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = '__all__'
    
class CitySerializers (serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'
    
class CountrySerializers (serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'
    
class AvatarSerializers (serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = '__all__'

class ProfilesSerializers(serializers.ModelSerializer):
    first_name = serializers.CharField(source = 'first.name', read_only = True)
    last_name = serializers.CharField(source = 'last.name', read_only = True)
    class Meta:
        model = Profile
        fields = '__all__'