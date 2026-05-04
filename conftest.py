import pytest
from users.models import User, Email  # Import Email model here
from profiles.models import Profiles


@pytest.fixture
def create_user(db):  # Add 'db' fixture to ensure database access
    """Factory for creating users"""
    def make_user(**kwargs):
        defaults = {
            "username": "testuser",
            "password": "password123",
        }
        
        # Handle the custom Email relationship
        email_str = kwargs.pop("email", "test@test.com")
        
        # Get or Create the Email object instead of passing a string
        email_obj, _ = Email.objects.get_or_create(email=email_str)
        defaults["email"] = email_obj
        
        defaults.update(kwargs)
        
        # Create the user with the Email object
        user = User.objects.create_user(**defaults)
        return user

    return make_user


@pytest.fixture
def user(create_user):
    return create_user()


@pytest.fixture
def profile(user):
    """Creates a profile for the user"""
    # Note: Ensure your Profiles model accepts these arguments. 
    # If Profiles uses FKs for first_name, last_name etc., you need to create those objects first.
    # Based on your previous test files, it seems Profiles might use simple CharFields/Integers 
    # OR separate models. 
    
    # CASE A: If Profiles uses simple fields (CharField, IntegerField):
    try:
        profile = Profiles.objects.create(
            user=user,
            first_name="John",
            last_name="Doe",
            bio="Hello world",
            age=25,
            gender="male",
            city="New York",
            country="USA"
        )
    except ValueError:
        # CASE B: If Profiles uses ForeignKeys to FirstName, LastName models (as seen in your other tests):
        from profiles.models import FirstName, LastName, Bio, Age, Gender, City, Country
        
        fn = FirstName.objects.create(first_name="John")
        ln = LastName.objects.create(last_name="Doe")
        bio_obj = Bio.objects.create(bio="Hello world")
        age_obj = Age.objects.create(age=25)
        gender_obj = Gender.objects.create(gender="male")
        city_obj = City.objects.create(city="New York")
        country_obj = Country.objects.create(country="USA")

        profile = Profiles.objects.create(
            user=user,
            first_name=fn,
            last_name=ln,
            bio=bio_obj,
            age=age_obj,
            gender=gender_obj,
            city=city_obj,
            country=country_obj
        )
        
    return profile