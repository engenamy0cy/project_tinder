import pytest
from profiles.models import Profile
from users.models import User


@pytest.fixture
def create_user():
    def make_user(**kwargs):
        defaults = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "password123",
        }
        defaults.update(kwargs)
        return User.objects.create_user(**defaults)

    return make_user


@pytest.fixture
def user(create_user):
    return create_user()


@pytest.fixture
def profile(user):
    return Profile.objects.create(
        user=user,
        first_name="John",
        last_name="Doe",
        bio="Hello world",
        age=25,
        gender="male",
        city="New York",
        country="USA",
    )
import pytest
from users.models import User
from profiles.models import Profile


@pytest.fixture
def create_user():
    """Фабрика для создания пользователей"""
    def make_user(**kwargs):
        defaults = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "password123",
        }
        defaults.update(kwargs)
        user = User.objects.create_user(**defaults)
        return user
    return make_user


@pytest.fixture
def user(create_user):
    return create_user()


@pytest.fixture
def profile(user):
    """Создает профиль для пользователя"""
    profile = Profile.objects.create(
        user=user,
        first_name="John",
        last_name="Doe",
        bio="Hello world",
        age=25,
        gender="male",
        city="New York",
        country="USA"
    )
    return profile