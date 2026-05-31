"""Единый JSON-профиль для API (согласован с мобильным клиентом)."""

from __future__ import annotations

from typing import Any

from django.conf import settings

from profiles.models import Game, Profiles


def _media_url(path: str | None) -> str | None:
    if not path:
        return None
    base = settings.MEDIA_URL.rstrip("/")
    return f"{base}/{path.lstrip('/')}"


def profile_to_card(profile: Profiles) -> dict[str, Any]:
    """Плоское представление профиля для списков, ленты и карточек."""
    user = profile.user
    games: list[dict[str, str]] = []
    if profile.main_game:
        games.append(
            {
                "code": profile.main_game.game,
                "label": profile.main_game.get_game_display(),
            }
        )
    seen = {g["code"] for g in games}
    for g in profile.games.all():
        if g.game not in seen:
            games.append({"code": g.game, "label": g.get_game_display()})
            seen.add(g.game)

    avatar_path = None
    if profile.avatar and profile.avatar.avatar:
        avatar_path = profile.avatar.avatar.name

    from users.services import UserStatusService

    return {
        "user_id": user.id,
        "username": user.username,
        "display_name": str(profile),
        "first_name": profile.first_name.first_name if profile.first_name else "",
        "last_name": profile.last_name.last_name if profile.last_name else "",
        "bio": profile.bio.bio if profile.bio else "",
        "age": profile.age.age if profile.age else None,
        "gender": profile.gender.gender if profile.gender else None,
        "gender_label": (
            profile.gender.get_gender_display() if profile.gender else None
        ),
        "hours_in_game": (
            profile.hours_in_game.hours if profile.hours_in_game else None
        ),
        "city": profile.city.city if profile.city else "",
        "country": profile.country.country if profile.country else "",
        "game": profile.main_game.game if profile.main_game else None,
        "game_label": (
            profile.main_game.get_game_display() if profile.main_game else None
        ),
        "games": games,
        "avatar_url": _media_url(avatar_path),
        "status": UserStatusService.get_status_payload(user),
    }


def ensure_default_games() -> None:
    for code, _label in Game.GAME_CHOICES:
        Game.objects.get_or_create(game=code)
