import pytest
from django.utils import timezone
from profiles.models import Profiles, FirstName, LastName, Bio, Age, Gender, City, Country, Avatar
from users.models import User, Email, Is_verifed, Is_online, Created_at, Updated_at, Last_activity


@pytest.mark.django_db
def test_create_first_name():
    first_name = FirstName.objects.create(first_name="Alice")
    assert first_name.first_name == "Alice"
    assert str(first_name) == "Alice"


@pytest.mark.django_db
def test_create_last_name():
    last_name = LastName.objects.create(last_name="Smith")
    assert last_name.last_name == "Smith"
    assert str(last_name) == "Smith"
    
    empty_last_name = LastName.objects.create(last_name="")
    assert empty_last_name.last_name == ""
    assert str(empty_last_name) == ""


@pytest.mark.django_db
def test_create_bio():
    bio = Bio.objects.create(bio="This is a test bio")
    assert bio.bio == "This is a test bio"
    assert str(bio) == "This is a test bio"
    
    empty_bio = Bio.objects.create(bio="")
    assert empty_bio.bio == ""
    assert str(empty_bio) == ""


@pytest.mark.django_db
def test_create_age():
    age = Age.objects.create(age=30)
    assert age.age == 30
    assert int(age) == 30


@pytest.mark.django_db
def test_create_gender():
    gender = Gender.objects.create(gender="female")
    assert gender.gender == "female"
    assert str(gender) == "female"


@pytest.mark.django_db
def test_create_city():
    city = City.objects.create(city="Paris")
    assert city.city == "Paris"
    assert str(city) == "Paris"


@pytest.mark.django_db
def test_create_country():
    country = Country.objects.create(country="France")
    assert country.country == "France"
    assert str(country) == "France"


@pytest.mark.django_db
def test_create_avatar():
    avatar = Avatar.objects.create(avatar=None)
    assert avatar.avatar is None
    assert Avatar.objects.count() == 1


@pytest.mark.django_db
def test_create_profile():
    first_name = FirstName.objects.create(first_name="Alice")
    last_name = LastName.objects.create(last_name="Smith")
    bio = Bio.objects.create(bio="Bio here")
    age = Age.objects.create(age=30)
    gender = Gender.objects.create(gender="female")
    city = City.objects.create(city="Paris")
    country = Country.objects.create(country="France")
    
    profile = Profiles.objects.create(
        first_name=first_name,
        last_name=last_name,
        bio=bio,
        age=age,
        gender=gender,
        city=city,
        country=country,
    )
    
    assert profile.first_name == first_name
    assert profile.last_name == last_name
    assert profile.bio == bio
    assert profile.age == age
    assert profile.gender == gender
    assert profile.city == city
    assert profile.country == country
    assert profile.first_name.first_name == "Alice"
    assert profile.last_name.last_name == "Smith"
    assert profile.bio.bio == "Bio here"
    assert profile.age.age == 30
    assert profile.gender.gender == "female"
    assert profile.city.city == "Paris"
    assert profile.country.country == "France"


@pytest.mark.django_db
def test_profile_str():
    first_name = FirstName.objects.create(first_name="Alice")
    last_name = LastName.objects.create(last_name="Smith")
    profile = Profiles.objects.create(first_name=first_name, last_name=last_name)
    assert str(profile) == "Alice Smith"


@pytest.mark.django_db
def test_profile_str_without_name():
    profile = Profiles.objects.create()
    assert str(profile) == f"Profile {profile.id}"


@pytest.mark.django_db
def test_create_email():
    email = Email.objects.create(email="test@example.com")
    assert email.email == "test@example.com"
    assert str(email) == "test@example.com"


@pytest.mark.django_db
def test_create_is_verified():
    is_verified = Is_verifed.objects.create(is_verified=True)
    assert is_verified.is_verified is True
    assert str(is_verified) == "True"
    
    false_verified = Is_verifed.objects.create(is_verified=False)
    assert false_verified.is_verified is False
    assert str(false_verified) == "False"


@pytest.mark.django_db
def test_create_is_online():
    is_online = Is_online.objects.create(is_online=True)
    assert is_online.is_online is True
    assert str(is_online) == "True"


@pytest.mark.django_db
def test_create_created_at():
    created_at = Created_at.objects.create()
    assert created_at.created_at is not None
    assert str(created_at) is not None


@pytest.mark.django_db
def test_create_updated_at():
    updated_at = Updated_at.objects.create()
    assert updated_at.updated_at is not None
    assert str(updated_at) is not None


@pytest.mark.django_db
def test_create_last_activity():
    last_activity = Last_activity.objects.create(last_activity=None)
    assert last_activity.last_activity is None
    assert str(last_activity) == "None"


@pytest.mark.django_db
def test_create_last_activity_with_date():
    now = timezone.now()
    last_activity = Last_activity.objects.create(last_activity=now)
    assert last_activity.last_activity is not None
    assert str(last_activity) is not None


@pytest.mark.django_db
def test_create_user():
    email = Email.objects.create(email="test@example.com")
    is_verified = Is_verifed.objects.create(is_verified=True)
    is_online = Is_online.objects.create(is_online=True)
    created_at = Created_at.objects.create()
    updated_at = Updated_at.objects.create()
    last_activity = Last_activity.objects.create()
    
    user = User.objects.create(
        username="testuser",
        email=email,
        is_verified=is_verified,
        is_online=is_online,
        created_at=created_at,
        updated_at=updated_at,
        last_activity=last_activity
    )
    user.set_password("testpass123")
    user.save()
    
    assert user.username == "testuser"
    assert user.check_password("testpass123")
    assert user.email == email
    assert user.is_verified == is_verified
    assert user.is_online == is_online
    assert user.created_at == created_at
    assert user.updated_at == updated_at
    assert user.last_activity == last_activity


@pytest.mark.django_db
def test_user_str():
    user = User.objects.create(username="testuser")
    assert str(user) == "testuser"


@pytest.mark.django_db
def test_complete_profile_creation():
    first_name = FirstName.objects.create(first_name="John")
    last_name = LastName.objects.create(last_name="Doe")
    bio = Bio.objects.create(bio="Software developer")
    age = Age.objects.create(age=25)
    gender = Gender.objects.create(gender="male")
    city = City.objects.create(city="New York")
    country = Country.objects.create(country="USA")
    email = Email.objects.create(email="john@example.com")
    is_verified = Is_verifed.objects.create(is_verified=True)
    is_online = Is_online.objects.create(is_online=True)
    created_at = Created_at.objects.create()
    updated_at = Updated_at.objects.create()
    last_activity = Last_activity.objects.create()
    
    user = User.objects.create(
        username="johndoe",
        email=email,
        is_verified=is_verified,
        is_online=is_online,
        created_at=created_at,
        updated_at=updated_at,
        last_activity=last_activity
    )
    
    profile = Profiles.objects.create(
        first_name=first_name,
        last_name=last_name,
        bio=bio,
        age=age,
        gender=gender,
        city=city,
        country=country
    )
    
    assert profile.first_name.first_name == "John"
    assert profile.last_name.last_name == "Doe"
    assert profile.age.age == 25
    assert profile.bio.bio == "Software developer"
    assert profile.gender.gender == "male"
    assert profile.city.city == "New York"
    assert profile.country.country == "USA"
    assert user.email.email == "john@example.com"
    assert user.is_verified.is_verified is True
    assert user.is_online.is_online is True


@pytest.mark.django_db
def test_profile_optional_fields():
    profile = Profiles.objects.create()
    
    assert profile.first_name is None
    assert profile.last_name is None
    assert profile.bio is None
    assert profile.age is None
    assert profile.gender is None
    assert profile.city is None
    assert profile.country is None
    assert profile.avatar is None


@pytest.mark.django_db
def test_update_profile():
    first_name = FirstName.objects.create(first_name="Alice")
    profile = Profiles.objects.create(first_name=first_name)
    
    new_first_name = FirstName.objects.create(first_name="Bob")
    profile.first_name = new_first_name
    profile.save()
    
    assert profile.first_name.first_name == "Bob"


@pytest.mark.django_db
def test_delete_profile():
    profile = Profiles.objects.create()
    profile_id = profile.id
    profile.delete()
    
    with pytest.raises(Profiles.DoesNotExist):
        Profiles.objects.get(id=profile_id)


@pytest.mark.django_db
def test_create_multiple_profiles():
    first_name1 = FirstName.objects.create(first_name="Alice")
    first_name2 = FirstName.objects.create(first_name="Bob")
    
    profile1 = Profiles.objects.create(first_name=first_name1)
    profile2 = Profiles.objects.create(first_name=first_name2)
    
    assert Profiles.objects.count() == 2
    assert profile1.first_name.first_name == "Alice"
    assert profile2.first_name.first_name == "Bob"


@pytest.mark.django_db
def test_email_str_method():
    email = Email.objects.create(email="test@test.com")
    assert str(email) == "test@test.com"


@pytest.mark.django_db
def test_gender_str_method():
    gender = Gender.objects.create(gender="male")
    assert str(gender) == "male"


@pytest.mark.django_db
def test_city_str_method():
    city = City.objects.create(city="Moscow")
    assert str(city) == "Moscow"


@pytest.mark.django_db
def test_country_str_method():
    country = Country.objects.create(country="Russia")
    assert str(country) == "Russia"


@pytest.mark.django_db
def test_bio_str_method():
    bio = Bio.objects.create(bio="Test bio")
    assert str(bio) == "Test bio"


@pytest.mark.django_db
def test_first_name_str_method():
    first_name = FirstName.objects.create(first_name="John")
    assert str(first_name) == "John"


@pytest.mark.django_db
def test_last_name_str_method():
    last_name = LastName.objects.create(last_name="Doe")
    assert str(last_name) == "Doe"


@pytest.mark.django_db
def test_avatar_str_method():
    avatar = Avatar.objects.create(avatar=None)
    assert str(avatar) == "None"