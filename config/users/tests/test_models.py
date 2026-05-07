import pytest
from django.utils import timezone
from users.models import (
    Email, Is_verifed, Is_online, Created_at, 
    Updated_at, Last_activity, User
)

@pytest.mark.django_db
def test_email_creation():
    email = Email.objects.create(email="test@example.com")
    assert str(email) == "test@example.com"
    assert email.email == "test@example.com"

@pytest.mark.django_db
def test_email_unique():
    Email.objects.create(email="unique@example.com")
    with pytest.raises(Exception):
        Email.objects.create(email="unique@example.com")

@pytest.mark.django_db
def test_is_verified_creation():
    is_verified = Is_verifed.objects.create(is_verified=True)
    assert str(is_verified) == "True"
    assert is_verified.is_verified is True

@pytest.mark.django_db
def test_is_verified_default():
    is_verified = Is_verifed.objects.create()
    assert str(is_verified) == "False"
    assert is_verified.is_verified is False

@pytest.mark.django_db
def test_is_online_creation():
    is_online = Is_online.objects.create(is_online=True)
    assert str(is_online) == "True"
    assert is_online.is_online is True

@pytest.mark.django_db
def test_is_online_default():
    is_online = Is_online.objects.create()
    assert str(is_online) == "False"
    assert is_online.is_online is False

@pytest.mark.django_db
def test_created_at_creation():
    created_at = Created_at.objects.create()
    assert str(created_at) is not None
    assert created_at.created_at is not None

@pytest.mark.django_db
def test_updated_at_creation():
    updated_at = Updated_at.objects.create()
    assert str(updated_at) is not None
    assert updated_at.updated_at is not None

@pytest.mark.django_db
def test_last_activity_creation():
    now = timezone.now()
    last_activity = Last_activity.objects.create(last_activity=now)
    assert str(last_activity) == str(now)
    assert last_activity.last_activity == now

@pytest.mark.django_db
def test_last_activity_null():
    last_activity = Last_activity.objects.create(last_activity=None)
    assert str(last_activity) == "None"
    assert last_activity.last_activity is None

# Исправленные тесты для модели User
@pytest.mark.django_db
def test_user_creation_without_optional_fields():
    # Используем create() вместо create_user()
    user = User.objects.create(
        username="john_doe",
        password="testpass123"
    )
    user.set_password("testpass123")  # Хешируем пароль
    user.save()
    
    assert str(user) == "john_doe"
    assert user.username == "john_doe"
    assert user.email is None
    assert user.is_verified is None
    assert user.is_online is None
    assert user.created_at is None
    assert user.updated_at is None
    assert user.last_activity is None
    assert user.check_password("testpass123")  # Проверяем пароль

@pytest.mark.django_db
def test_user_with_all_fields():
    # Создаем вспомогательные объекты
    email_obj = Email.objects.create(email="john@example.com")
    is_verified_obj = Is_verifed.objects.create(is_verified=True)
    is_online_obj = Is_online.objects.create(is_online=True)
    created_at_obj = Created_at.objects.create()
    updated_at_obj = Updated_at.objects.create()
    last_activity_obj = Last_activity.objects.create(last_activity=timezone.now())
    
    # Создаем пользователя со всеми полями
    user = User.objects.create(
        username="john_doe_full",
        password="testpass123",
        email=email_obj,
        is_verified=is_verified_obj,
        is_online=is_online_obj,
        created_at=created_at_obj,
        updated_at=updated_at_obj,
        last_activity=last_activity_obj
    )
    user.set_password("testpass123")
    user.save()
    
    assert user.username == "john_doe_full"
    assert user.email.email == "john@example.com"
    assert user.is_verified.is_verified is True
    assert user.is_online.is_online is True
    assert user.created_at is not None
    assert user.updated_at is not None
    assert user.last_activity is not None

@pytest.mark.django_db
def test_user_email_relationship():
    email_obj = Email.objects.create(email="jane@example.com")
    user = User.objects.create(
        username="jane_doe",
        password="testpass123",
        email=email_obj
    )
    
    assert user.email.email == "jane@example.com"
    assert str(user.email) == "jane@example.com"

@pytest.mark.django_db
def test_user_is_verified_relationship():
    is_verified_obj = Is_verifed.objects.create(is_verified=False)
    user = User.objects.create(
        username="unverified_user",
        password="testpass123",
        is_verified=is_verified_obj
    )
    
    assert user.is_verified.is_verified is False
    assert str(user.is_verified) == "False"

@pytest.mark.django_db
def test_user_is_online_relationship():
    is_online_obj = Is_online.objects.create(is_online=False)
    user = User.objects.create(
        username="offline_user",
        password="testpass123",
        is_online=is_online_obj
    )
    
    assert user.is_online.is_online is False
    assert str(user.is_online) == "False"

@pytest.mark.django_db
def test_user_timestamps():
    created_at_obj = Created_at.objects.create()
    updated_at_obj = Updated_at.objects.create()
    last_activity_obj = Last_activity.objects.create(last_activity=timezone.now())
    
    user = User.objects.create(
        username="timed_user",
        password="testpass123",
        created_at=created_at_obj,
        updated_at=updated_at_obj,
        last_activity=last_activity_obj
    )
    
    assert user.created_at is not None
    assert user.updated_at is not None
    assert user.last_activity is not None
    assert user.created_at.created_at <= timezone.now()

@pytest.mark.django_db
def test_user_str_method():
    user = User.objects.create(username="testuser", password="pass123")
    assert str(user) == "testuser"

@pytest.mark.django_db
def test_user_creation_with_email_only():
    """Тест создания пользователя только с email"""
    email_obj = Email.objects.create(email="only_email@example.com")
    user = User.objects.create(
        username="email_only_user",
        email=email_obj
    )
    
    assert user.email.email == "only_email@example.com"
    assert user.username == "email_only_user"

@pytest.mark.django_db
def test_user_update_related_fields():
    """Тест обновления связанных полей пользователя"""
    email_obj1 = Email.objects.create(email="first@example.com")
    email_obj2 = Email.objects.create(email="second@example.com")
    
    user = User.objects.create(
        username="update_test_user",
        email=email_obj1
    )
    
    assert user.email.email == "first@example.com"
    
    # Обновляем email
    user.email = email_obj2
    user.save()
    user.refresh_from_db()
    
    assert user.email.email == "second@example.com"