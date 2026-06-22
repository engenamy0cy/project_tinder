from django.contrib.auth import authenticate
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from profiles.profile_payload import profile_to_card

from .models import User
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


def _auth_response(user: User) -> dict:
    profile = getattr(user, "profile", None)
    return {
        "ok": True,
        "user": UserSerializer(user).data,
        "profile": profile_to_card(profile) if profile else None,
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    return Response(_auth_response(user), status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    print("=== LOGIN REQUEST ===")
    print(f"  POST data: {request.data}")
    serializer = UserLoginSerializer(data=request.data)
    if not serializer.is_valid():
        print(f"  Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]
    print(f"  Authenticating: username='{username}', password_len={len(password)}")

    try:
        user_obj = User.objects.get(username=username)
        print(f"  User found: id={user_obj.id}, password_hash={user_obj.password[:30]}...")
    except User.DoesNotExist:
        print(f"  User NOT FOUND in DB: {username}")

    user = authenticate(username=username, password=password)
    if not user:
        print("  authenticate() returned None!")
        return Response(
            {"detail": "Неверные учетные данные"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    print(f"  authenticate() OK: user_id={user.id}")
    return Response(_auth_response(user))
