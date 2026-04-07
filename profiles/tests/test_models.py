import pytest
from profiles.models import Profile


@pytest.mark.django_db
def test_create_profile(user):
    profile = Profile.objects.create(
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
def test_profile_str(profile):
    assert str(profile) == f"{profile.first_name} ({profile.user.username})"