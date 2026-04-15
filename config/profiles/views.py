from rest_framework import viewsets
from .models import FirstName, LastName, Age, Country, City, Gender, Avatar, Bio, Profiles
from .serializers import FirstNameSerializers, LastNameSerializers, BioSerializers, AgeSerializers,  GenderSerializers, CitySerializers, CountrySerializers, AvatarSerializers, ProfilesSerializers

class FirstNameViewSet(viewsets.ModelViewSet):
    queryset = FirstName.objects.all()
    serializer_class = FirstNameSerializers

class LastNameViewSet(viewsets.ModelViewSet):
    queryset = LastName.objects.all()
    serializer_class = LastNameSerializers

class BioViewSet(viewsets.ModelViewSet):
    queryset = Bio.objects.all()
    serializer_class = BioSerializers

class AgeViewSet(viewsets.ModelViewSet):
    queryset = Age.objects.all()
    serializer_class = AgeSerializers

class GenderViewSet(viewsets.ModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializers

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializers

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializers

class AvatarViewSet(viewsets.ModelViewSet):
    queryset = Avatar.objects.all()
    serializer_class = AvatarSerializers

class ProfilesViewSet(viewsets.ModelViewSet):
    queryset = Profiles.objects.all()
    serializer_class = ProfilesSerializers


