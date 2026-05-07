import pytest
from profiles.models import (
    FirstName, LastName, Bio, Age, Gender, 
    City, Country, Avatar, Profiles
)
from users.models import User, Email


@pytest.mark.django_db
def test_first_name_creation():
    first_name = FirstName.objects.create(first_name="John")
    assert str(first_name) == "John"
    assert first_name.first_name == "John"


@pytest.mark.django_db
def test_last_name_creation():
    last_name = LastName.objects.create(last_name="Doe")
    assert str(last_name) == "Doe"
    assert last_name.last_name == "Doe"


@pytest.mark.django_db
def test_last_name_blank():
    last_name = LastName.objects.create(last_name="")
    assert str(last_name) == ""
    assert last_name.last_name == ""


@pytest.mark.django_db
def test_bio_creation():
    bio = Bio.objects.create(bio="This is a bio")
    assert str(bio) == "This is a bio"
    assert bio.bio == "This is a bio"


@pytest.mark.django_db
def test_bio_blank():
    bio = Bio.objects.create(bio="")
    assert str(bio) == ""


@pytest.mark.django_db
def test_age_creation():
    age = Age.objects.create(age=25)
    assert int(age) == 25
    assert age.age == 25


@pytest.mark.django_db
def test_gender_creation():
    gender = Gender.objects.create(gender="Male", status_gen="Мужской")
    assert str(gender) == "Male"
    assert gender.status_gen == "Мужской"


@pytest.mark.django_db
def test_city_creation():
    city = City.objects.create(city="Moscow")
    assert str(city) == "Moscow"
    assert city.city == "Moscow"


@pytest.mark.django_db
def test_country_creation():
    country = Country.objects.create(country="Russia")
    assert str(country) == "Russia"
    assert country.country == "Russia"


@pytest.mark.django_db
def test_profile_full_name():
    user = User.objects.create(username="alice_wonder")
    
    first_name = FirstName.objects.create(first_name="Alice")
    last_name = LastName.objects.create(last_name="Smith")
    bio = Bio.objects.create(bio="Bio text")
    age = Age.objects.create(age=30)
    gender = Gender.objects.create(gender="Female", status_gen="Женский")
    city = City.objects.create(city="Paris")
    country = Country.objects.create(country="France")
    
    profile = Profiles.objects.create(
        user = user,
        first_name=first_name,
        last_name=last_name,
        bio=bio,
        age=age,
        gender=gender,
        city=city,
        country=country
    )
    
    assert str(profile) == "Alice Smith"
    assert profile.first_name.first_name == "Alice"
    assert profile.last_name.last_name == "Smith"
    assert profile.age.age == 30
    assert profile.city.city == "Paris"


@pytest.mark.django_db
def test_profile_without_names():
    user = User.objects.create(username="bob_roberts")
    
    bio = Bio.objects.create(bio="Bio text")
    age = Age.objects.create(age=25)
    gender = Gender.objects.create(gender="Male", status_gen="Мужской")
    city = City.objects.create(city="London")
    country = Country.objects.create(country="UK")
    
    profile = Profiles.objects.create(
        user=user,
        bio=bio,
        age=age,
        gender=gender,
        city=city,
        country=country
    )
    
    assert f"Profile {profile.id}" in str(profile)


@pytest.mark.django_db
def test_profile_null_fields():
    user = User.objects.create(username="charlie_brown")
    profile = Profiles.objects.create(user=user)
    
    assert profile.first_name is None
    assert profile.last_name is None
    assert str(profile) == f"Profile {profile.id}"
    assert profile.user == user