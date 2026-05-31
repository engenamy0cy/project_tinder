"""Создание и обновление профиля из плоского JSON (без ручных FK на клиенте)."""

from __future__ import annotations

from typing import Any

from django.contrib.auth import get_user_model
from django.db import transaction

from profiles.models import (
    Age,
    Avatar,
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
from profiles.profile_payload import ensure_default_games, profile_to_card

User = get_user_model()


def _set_fk_text(model_cls, field_name: str, value: str | None):
    if value is None or value == "":
        return None
    obj, _ = model_cls.objects.get_or_create(**{field_name: value.strip()})
    return obj


def _set_fk_int(model_cls, field_name: str, value: int | None):
    if value is None:
        return None
    obj, _ = model_cls.objects.get_or_create(**{field_name: int(value)})
    return obj


@transaction.atomic
def upsert_profile(user_id: int, data: dict[str, Any]) -> dict[str, Any]:
    ensure_default_games()
    user = User.objects.get(pk=user_id)
    profile, _ = Profiles.objects.get_or_create(user=user)

    if "first_name" in data:
        profile.first_name = _set_fk_text(FirstName, "first_name", data.get("first_name"))
    if "last_name" in data:
        profile.last_name = _set_fk_text(LastName, "last_name", data.get("last_name"))
    if "bio" in data:
        profile.bio = _set_fk_text(Bio, "bio", data.get("bio"))
    if "age" in data:
        profile.age = _set_fk_int(Age, "age", data.get("age"))
    if "hours_in_game" in data:
        profile.hours_in_game = _set_fk_int(
            Hours_in_game, "hours", data.get("hours_in_game")
        )
    if "gender" in data and data.get("gender"):
        gender_val = data["gender"]
        obj, _ = Gender.objects.get_or_create(gender=gender_val)
        profile.gender = obj
    if "city" in data:
        profile.city = _set_fk_text(City, "city", data.get("city"))
    if "country" in data:
        profile.country = _set_fk_text(Country, "country", data.get("country"))

    if "game" in data and data.get("game"):
        game, _ = Game.objects.get_or_create(game=data["game"])
        profile.main_game = game

    extra_games = data.get("games") or []
    if extra_games:
        game_objs = []
        for code in extra_games:
            g, _ = Game.objects.get_or_create(game=code)
            game_objs.append(g)
        profile.games.set(game_objs)

    profile.save()

    profile = (
        Profiles.objects.filter(user_id=user_id)
        .select_related(
            "user",
            "first_name",
            "last_name",
            "bio",
            "age",
            "gender",
            "hours_in_game",
            "city",
            "country",
            "main_game",
            "avatar",
        )
        .prefetch_related("games")
        .get()
    )
    return profile_to_card(profile)
