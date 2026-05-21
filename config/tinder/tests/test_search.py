import pytest

from profiles.models import Age, Game, Gender, Hours_in_game, Profiles
from tinder.services import SearchService
from users.models import User


@pytest.mark.django_db
def test_search_filters_game_age_gender_hours():
    g = Game.objects.create(game="cs2")
    viewer = User.objects.create_user("viewer", "v@t.com", "p")
    match_user = User.objects.create_user("found", "f@t.com", "p")
    other = User.objects.create_user("other", "o@t.com", "p")

    Profiles.objects.create(
        user=match_user,
        main_game=g,
        age=Age.objects.create(age=22),
        gender=Gender.objects.create(gender="Man"),
        hours_in_game=Hours_in_game.objects.create(hours=500),
    )
    Profiles.objects.create(
        user=other,
        main_game=g,
        age=Age.objects.create(age=30),
        gender=Gender.objects.create(gender="Woman"),
        hours_in_game=Hours_in_game.objects.create(hours=100),
    )

    cards = SearchService.search(
        viewer.id,
        game="cs2",
        age=22,
        gender="Man",
        hours_min=400,
        hours_max=600,
    )
    assert len(cards) == 1
    assert cards[0]["user_id"] == match_user.id
    assert len(cards[0]["actions"]) == 3
    assert cards[0]["actions"][0]["label"] == "Да"


@pytest.mark.django_db
def test_yes_no_message_flow():
    a = User.objects.create_user("a", "a@t.com", "p")
    b = User.objects.create_user("b", "b@t.com", "p")

    yes = SearchService.perform_action(a.id, b.id, "yes")
    assert yes["ok"] is True
    assert yes["match"] is False

    bad_msg = SearchService.perform_action(a.id, b.id, "message", text="hi")
    assert bad_msg["ok"] is False

    no = SearchService.perform_action(a.id, b.id, "no")
    assert no["ok"] is True

    SearchService.perform_action(b.id, a.id, "yes")
    SearchService.perform_action(a.id, b.id, "yes")
    msg = SearchService.perform_action(a.id, b.id, "message", text="Привет!")
    assert msg["ok"] is True
