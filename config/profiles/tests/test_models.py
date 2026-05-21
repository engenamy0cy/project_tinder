import pytest

from profiles.models import Age, Bio, City, Country, FirstName, Game, Gender, LastName, Profiles
from users.models import User


@pytest.mark.django_db
def test_game_str():
    game = Game.objects.create(game="dota2")
    assert "Dota" in str(game)


@pytest.mark.django_db
def test_profile_full_name():
    user = User.objects.create_user(username="alice", email="a@t.com", password="x")
    profile = Profiles.objects.create(
        user=user,
        first_name=FirstName.objects.create(first_name="Alice"),
        last_name=LastName.objects.create(last_name="Smith"),
        bio=Bio.objects.create(bio="Bio"),
        age=Age.objects.create(age=30),
        gender=Gender.objects.create(gender="Woman"),
        city=City.objects.create(city="Paris"),
        country=Country.objects.create(country="France"),
        main_game=Game.objects.create(game="cs2"),
    )
    assert str(profile) == "Alice Smith"


@pytest.mark.django_db
def test_profile_without_names(user):
    profile = Profiles.objects.create(user=user)
    assert f"Profile {user.pk}" in str(profile)


@pytest.mark.django_db
def test_profile_games_m2m(user, game_dota2):
    cs2 = Game.objects.create(game="cs2")
    profile = Profiles.objects.create(user=user, main_game=game_dota2)
    profile.games.add(cs2)
    assert profile.games.count() == 1
