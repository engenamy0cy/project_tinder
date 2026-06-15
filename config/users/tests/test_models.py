import pytest
from django.utils import timezone

from users.models import User


@pytest.mark.django_db
def test_user_auto_status_on_create():
    user = User.objects.create_user(
        username="john",
        email="john@example.com",
        password="secret123",
    )
    assert user.is_verified is True
    assert user.is_online is True
    assert user.last_activity is not None
    delta = timezone.now() - user.last_activity
    assert delta.total_seconds() < 60


@pytest.mark.django_db
def test_touch_activity_updates_time():
    user = User.objects.create_user("jane", "jane@t.com", "pass")
    old = user.last_activity
    user.touch_activity()
    user.refresh_from_db()
    assert user.last_activity >= old


@pytest.mark.django_db
def test_create_superuser():
    admin = User.objects.create_superuser(
        username="admin",
        email="admin@test.com",
        password="adminpass",
    )
    assert admin.is_superuser
    assert admin.is_verified is True
