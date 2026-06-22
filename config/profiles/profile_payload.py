from __future__ import annotations
from typing import Any
from profiles.models import Game, Profiles

def profile_to_card(profile: Profiles) -> dict[str, Any]:
    """Плоское представление профиля для списков, ленты и карточек."""
    user = profile.user
    games_list: list[dict[str, str]] = []
    if profile.main_game:
        games_list.append(
            {
                "code": profile.main_game.game,
                "label": profile.main_game.get_game_display(),
            }
        )
    seen = {g["code"] for g in games_list}
    for g in profile.games.all():
        if g.game not in seen:
            games_list.append({"code": g.game, "label": g.get_game_display()})
            seen.add(g.game)

    avatar_url = None
    if profile.avatar_data:
        avatar_url = f"/profiles/avatar/{user.id}/"

    status_payload = {
        "is_online": getattr(user, "is_online", False),
        "last_activity": getattr(user, "last_activity", None),
    }

    return {
        "user_id": user.id,
        "username": user.username,
        "display_name": str(profile),
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "bio": profile.bio,
        "age": profile.age,
        "gender": profile.gender,
        "gender_label": profile.get_gender_display(),
        "hours_in_game": profile.hours_in_game,
        "city": profile.city,
        "country": profile.country,
        "game": profile.main_game.game if profile.main_game else None,
        "game_label": (
            profile.main_game.get_game_display() if profile.main_game else None
        ),
        "games": games_list,
        "avatar_url": avatar_url,
        "status": status_payload,
    }

def ensure_default_games() -> None:
    for code, _label in Game.GAME_CHOICES:
        Game.objects.get_or_create(game=code)
