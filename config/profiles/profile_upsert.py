"""Создание и обновление профиля из плоского JSON (без ручных FK на клиенте)."""

from __future__ import annotations
from typing import Any
from django.contrib.auth import get_user_model
from django.db import transaction
from profiles.models import Game, Profiles
from profiles.profile_payload import ensure_default_games, profile_to_card

User = get_user_model()

@transaction.atomic
def upsert_profile(user_id: int, data: dict[str, Any]) -> dict[str, Any]:
    ensure_default_games()
    user = User.objects.get(pk=user_id)
    profile, _ = Profiles.objects.get_or_create(user=user)

    avatar_base64 = data.pop("avatar_base64", None)

    for field in ["first_name", "last_name", "bio", "age", "hours_in_game", "gender", "city", "country"]:
        if field in data:
            setattr(profile, field, data[field])

    if "game" in data and data["game"]:
        game_obj, _ = Game.objects.get_or_create(game=data["game"])
        profile.main_game = game_obj

    if "extra_games" in data:
        game_objs = []
        for code in data["extra_games"]:
            g, _ = Game.objects.get_or_create(game=code)
            game_objs.append(g)
        profile.games.set(game_objs)

    if avatar_base64:
        profile.avatar_data = avatar_base64

    profile.save()

    profile = (
        Profiles.objects.filter(user_id=user_id)
        .select_related("user", "main_game")
        .prefetch_related("games")
        .get()
    )
    return profile_to_card(profile)
