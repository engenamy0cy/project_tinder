import pytest

from profiles.models import Game, Profiles
from users.models import User


@pytest.mark.django_db
def test_game_str():
    game = Game.objects.create(game="dota2")
    assert "Dota" in str(game)


@pytest.mark.django_db
def test_profile_full_name():
    user = User.objects.create_user(username="alice", email="a@t.com", password="x")
    profile = user.profile
    profile.first_name = "Alice"
    profile.last_name = "Smith"
    profile.bio = "Bio"
    profile.age = 30
    profile.gender = "Woman"
    profile.city = "Paris"
    profile.country = "France"
    profile.main_game = Game.objects.create(game="cs2")
    profile.save()
    assert str(profile) == "Alice Smith"


@pytest.mark.django_db
def test_profile_without_names(user):
    profile = user.profile
    assert f"Profile {user.pk}" in str(profile)


@pytest.mark.django_db
def test_profile_games_m2m(user, game_dota2):
    cs2 = Game.objects.create(game="cs2")
    profile = user.profile
    profile.main_game = game_dota2
    profile.save()
    profile.games.add(cs2)
    assert profile.games.count() == 1
