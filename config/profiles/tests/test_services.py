import pytest

from profiles.models import Age, Game, Gender, Hours_in_game, Profiles
from profiles.services import SwipeService
from tinder.services import SearchService
from users.models import User


@pytest.mark.django_db
def test_search_excludes_swiped():
    g = Game.objects.create(game="dota2")
    me = User.objects.create_user("me", "me@t.com", "p")
    other = User.objects.create_user("other", "o@t.com", "p")
    Profiles.objects.create(user=me, main_game=g)
    Profiles.objects.create(
        user=other,
        main_game=g,
        age=Age.objects.create(age=20),
        gender=Gender.objects.create(gender="Man"),
        hours_in_game=Hours_in_game.objects.create(hours=10),
    )

    assert len(SearchService.search(me.id, game="dota2")) == 1
    SearchService.perform_action(me.id, other.id, "no")
    assert len(SearchService.search(me.id, game="dota2")) == 0


@pytest.mark.django_db
def test_mutual_yes_creates_match():
    a = User.objects.create_user("a", "a@t.com", "p")
    b = User.objects.create_user("b", "b@t.com", "p")
    SearchService.perform_action(b.id, a.id, "yes")
    SearchService.perform_action(a.id, b.id, "yes")
    matches = SwipeService.get_matches_for_user(a.id)
    assert len(matches) == 1
