"""
Сервисная логика профилей. Поиск и свайпы — в tinder.services.SearchService.
"""

from typing import List, Set

from django.db.models import Q

from profiles.models import Game, Profiles
from tinder.services import SearchService


class ProfileSelectionService:
    @staticmethod
    def get_profiles_by_game(game_code: str) -> List[Profiles]:
        return list(
            Profiles.objects.filter(
                Q(main_game__game=game_code) | Q(games__game=game_code)
            )
            .select_related("user", "main_game", "age", "gender", "hours_in_game")
            .distinct()
        )

    @staticmethod
    def get_profiles_by_games(game_codes: List[str]) -> List[Profiles]:
        if not game_codes:
            return []
        game_set: Set[str] = set(game_codes)
        result = []
        for profile in Profiles.objects.prefetch_related("games").select_related(
            "main_game"
        ):
            profile_games: Set[str] = set(
                profile.games.values_list("game", flat=True)
            )
            if profile.main_game:
                profile_games.add(profile.main_game.game)
            if game_set.issubset(profile_games):
                result.append(profile)
        return result

    @staticmethod
    def get_feed_for_user(
        user_id: int, game_codes: List[str] | None = None, limit: int = 20
    ):
        return SearchService.search(
            user_id,
            game=game_codes[0] if game_codes else None,
            limit=limit,
        )


class SwipeService:
    """Обёртка для тестов; логика в SearchService."""

    record_swipe = staticmethod(SearchService._record_swipe)
    get_matches_for_user = staticmethod(SearchService.get_matches_for_user)
