import pytest

from profiles.models import (
    Age,
    Bio,
    City,
    Country,
    FirstName,
    Game,
    Gender,
    Hours_in_game,
    LastName,
    Profiles,
)
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
    return Profiles.objects.create(
        user=user,
        first_name=FirstName.objects.create(first_name="John"),
        last_name=LastName.objects.create(last_name="Doe"),
        bio=Bio.objects.create(bio="Hello world"),
        age=Age.objects.create(age=25),
        gender=Gender.objects.create(gender="Man"),
        city=City.objects.create(city="Moscow"),
        country=Country.objects.create(country="Russia"),
        main_game=game_dota2,
        hours_in_game=Hours_in_game.objects.create(hours=100),
    )
