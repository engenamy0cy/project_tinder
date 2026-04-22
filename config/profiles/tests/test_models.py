import pytest
from profiles.models import Profiles


@pytest.mark.django_db
def test_create_profile(user):
    profile = Profiles.objects.create(
        user=user,
        first_name="Alice",
        last_name="Smith",
        bio="Bio here",
        age=30,
        gender="female",
        city="Paris",
        country="France"
    )
    assert profile.first_name == "Alice"
    assert profile.user == user
    assert profile.city == "Paris"


@pytest.mark.django_db
def test_profile_str(profiles):
    assert str(profiles) == f"{profiles.first_name} ({profiles.user.username})"