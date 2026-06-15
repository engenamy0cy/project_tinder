import pytest

from profiles.models import Game, Profiles
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
def game_dota2(db):
    return Game.objects.create(game="dota2")


@pytest.fixture
def profile(user, game_dota2):
    profile = user.profile
    profile.first_name = "John"
    profile.last_name = "Doe"
    profile.bio = "Hello world"
    profile.age = 25
    profile.gender = "Man"
    profile.city = "Moscow"
    profile.country = "Russia"
    profile.main_game = game_dota2
    profile.hours_in_game = 100
    profile.save()
    return profile
