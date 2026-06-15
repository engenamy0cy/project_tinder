from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import SearchService


class SearchView(APIView):
    """
    GET — поиск анкет (игра, возраст, пол, часы в игре).
    POST — действие: yes (Да), no (Нет), message (Сообщение + text).
    """

    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)

        age = request.query_params.get("age")
        cards = SearchService.search(
            int(user_id),
            game=request.query_params.get("game"),
            age=int(age) if age else None,
            age_min=_int_or_none(request.query_params.get("age_min")),
            age_max=_int_or_none(request.query_params.get("age_max")),
            gender=request.query_params.get("gender"),
            hours_min=_int_or_none(request.query_params.get("hours_min")),
            hours_max=_int_or_none(request.query_params.get("hours_max")),
        )
        return Response({"results": cards, "count": len(cards)})

    def post(self, request):
        data = request.data
        from_user_id = data.get("from_user_id")
        to_user_id = data.get("to_user_id")
        action = data.get("action")

        if not all([from_user_id, to_user_id, action]):
            return Response(
                {"detail": "from_user_id, to_user_id, action required"},
                status=400,
            )

        result = SearchService.perform_action(
            int(from_user_id),
            int(to_user_id),
            action,
            text=data.get("text", ""),
        )
        code = status.HTTP_200_OK if result.get("ok") else status.HTTP_400_BAD_REQUEST
        return Response(result, status=code)


class MatchesView(APIView):
    """Список матчей после взаимных «Да»."""

    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"detail": "user_id required"}, status=400)
        return Response({"matches": SearchService.get_matches_for_user(int(user_id))})


class MessagesView(APIView):
    """Переписка внутри матча."""

    def get(self, request):
        match_id = request.query_params.get("match_id")
        user_id = request.query_params.get("user_id")
        if not match_id or not user_id:
            return Response(
                {"detail": "match_id and user_id required"}, status=400
            )
        data = SearchService.get_messages(int(match_id), int(user_id))
        if isinstance(data, dict) and not data.get("ok", True):
            return Response(data, status=400)
        return Response({"messages": data})

    def post(self, request):
        data = request.data
        result = SearchService.perform_action(
            int(data["from_user_id"]),
            int(data["to_user_id"]),
            "message",
            text=data.get("text", ""),
        )
        code = status.HTTP_200_OK if result.get("ok") else status.HTTP_400_BAD_REQUEST
        return Response(result, status=code)


def _int_or_none(value):
    if value is None or value == "":
        return None
    return int(value)
