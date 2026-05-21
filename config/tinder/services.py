"""
Поиск (search) и действия: Да / Нет / Сообщение.
"""

from typing import Any

from django.contrib.auth import get_user_model
from django.db.models import Q

from profiles.models import Profiles
from tinder.models import Match, Message, Swipe
from users.services import UserStatusService

User = get_user_model()

ACTIONS = ("yes", "no", "message")


class SearchService:
    @staticmethod
    def search(
        viewer_id: int,
        *,
        game: str | None = None,
        age: int | None = None,
        age_min: int | None = None,
        age_max: int | None = None,
        gender: str | None = None,
        hours_min: int | None = None,
        hours_max: int | None = None,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        UserStatusService.touch_activity(viewer_id)

        swiped_ids = Swipe.objects.filter(from_user_id=viewer_id).values_list(
            "to_user_id", flat=True
        )
        qs = (
            Profiles.objects.exclude(user_id=viewer_id)
            .exclude(user_id__in=swiped_ids)
            .select_related(
                "user",
                "user__is_verified",
                "user__is_online",
                "user__last_activity",
                "first_name",
                "last_name",
                "age",
                "gender",
                "hours_in_game",
                "main_game",
                "avatar",
            )
            .prefetch_related("games")
        )

        if game:
            qs = qs.filter(
                Q(main_game__game=game) | Q(games__game=game)
            ).distinct()
        if gender:
            qs = qs.filter(gender__gender=gender)
        if age is not None:
            qs = qs.filter(age__age=age)
        else:
            if age_min is not None:
                qs = qs.filter(age__age__gte=age_min)
            if age_max is not None:
                qs = qs.filter(age__age__lte=age_max)
        if hours_min is not None:
            qs = qs.filter(hours_in_game__hours__gte=hours_min)
        if hours_max is not None:
            qs = qs.filter(hours_in_game__hours__lte=hours_max)

        cards = []
        for profile in qs[:limit]:
            cards.append(SearchService._profile_card(profile))
        return cards

    @staticmethod
    def _profile_card(profile: Profiles) -> dict[str, Any]:
        user = profile.user
        name = str(profile)
        return {
            "user_id": user.id,
            "username": user.username,
            "display_name": name,
            "game": profile.main_game.game if profile.main_game else None,
            "game_label": (
                profile.main_game.get_game_display() if profile.main_game else None
            ),
            "age": profile.age.age if profile.age else None,
            "gender": profile.gender.gender if profile.gender else None,
            "hours_in_game": (
                profile.hours_in_game.hours if profile.hours_in_game else None
            ),
            "status": UserStatusService.get_status_payload(user),
            "actions": [
                {"id": "yes", "label": "Да"},
                {"id": "no", "label": "Нет"},
                {"id": "message", "label": "Сообщение"},
            ],
        }

    @staticmethod
    def perform_action(
        from_user_id: int,
        to_user_id: int,
        action: str,
        text: str = "",
    ) -> dict[str, Any]:
        UserStatusService.touch_activity(from_user_id)

        if action not in ACTIONS:
            return {"ok": False, "detail": f"action must be one of: {ACTIONS}"}

        if from_user_id == to_user_id:
            return {"ok": False, "detail": "cannot act on yourself"}

        if action == "yes":
            swipe = SearchService._record_swipe(from_user_id, to_user_id, is_like=True)
            match = SearchService._get_match_if_mutual(from_user_id, to_user_id)
            return {
                "ok": True,
                "action": "yes",
                "swipe_id": swipe.id,
                "match": match is not None,
                "match_id": match.id if match else None,
            }

        if action == "no":
            swipe = SearchService._record_swipe(from_user_id, to_user_id, is_like=False)
            return {"ok": True, "action": "no", "swipe_id": swipe.id}

        # message
        match = SearchService._get_match_between(from_user_id, to_user_id)
        if not match:
            return {
                "ok": False,
                "detail": "Сначала нужен взаимный лайк (Да + Да)",
            }
        if not text.strip():
            return {"ok": False, "detail": "text required for message"}
        msg = Message.objects.create(
            match=match, sender_id=from_user_id, text=text.strip()
        )
        return {"ok": True, "action": "message", "message_id": msg.id}

    @staticmethod
    def _record_swipe(from_user_id: int, to_user_id: int, is_like: bool) -> Swipe:
        swipe, _ = Swipe.objects.update_or_create(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            defaults={"is_like": is_like},
        )
        if is_like:
            SearchService._try_create_match(from_user_id, to_user_id)
        return swipe

    @staticmethod
    def _try_create_match(user_a_id: int, user_b_id: int) -> Match | None:
        mutual = Swipe.objects.filter(
            from_user_id=user_b_id,
            to_user_id=user_a_id,
            is_like=True,
        ).exists()
        if not mutual:
            return None
        low, high = sorted([user_a_id, user_b_id])
        match, _ = Match.objects.get_or_create(user_a_id=low, user_b_id=high)
        return match

    @staticmethod
    def _get_match_if_mutual(user_a_id: int, user_b_id: int) -> Match | None:
        SearchService._try_create_match(user_a_id, user_b_id)
        return SearchService._get_match_between(user_a_id, user_b_id)

    @staticmethod
    def _get_match_between(user_a_id: int, user_b_id: int) -> Match | None:
        low, high = sorted([user_a_id, user_b_id])
        return Match.objects.filter(user_a_id=low, user_b_id=high).first()

    @staticmethod
    def get_matches_for_user(user_id: int) -> list[dict[str, Any]]:
        matches = Match.objects.filter(
            Q(user_a_id=user_id) | Q(user_b_id=user_id)
        ).select_related("user_a", "user_b")
        result = []
        for m in matches:
            other = m.user_b if m.user_a_id == user_id else m.user_a
            result.append(
                {
                    "match_id": m.id,
                    "user_id": other.id,
                    "username": other.username,
                    "created_at": m.created_at.isoformat(),
                }
            )
        return result
