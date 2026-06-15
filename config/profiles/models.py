from django.conf import settings
from django.db import models

class Game(models.Model):
    """Игры для поиска тимейтов."""
    GAME_CHOICES = [
        ("dota2", "Dota 2"),
        ("cs2", "CS2"),
        ("majestic", "Majestic"),
    ]
    game = models.CharField(max_length=20, choices=GAME_CHOICES, unique=True)

    def __str__(self):
        return self.get_game_display()

class Profiles(models.Model):
    """Публичный профиль — то, что видят другие игроки."""
    GENDER_CHOICES = [
        ("Man", "Мужской"),
        ("Woman", "Женский"),
        ("dont_indicate", "Не указывать"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        primary_key=True,
    )
    first_name = models.CharField(max_length=50, blank=True, verbose_name="Имя")
    last_name = models.CharField(max_length=50, blank=True, verbose_name="Фамилия")
    bio = models.TextField(blank=True, verbose_name="Биография")
    age = models.IntegerField(null=True, blank=True, verbose_name="Возраст")
    hours_in_game = models.PositiveIntegerField(default=0, verbose_name="Часы в игре")
    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        default="dont_indicate",
        verbose_name="Пол",
    )
    city = models.CharField(max_length=100, blank=True, verbose_name="Город")
    country = models.CharField(max_length=100, blank=True, verbose_name="Страна")
    avatar = models.ImageField(upload_to="profile_photos/", blank=True, null=True, verbose_name="Аватар")

    main_game = models.ForeignKey(
        Game,
        on_delete=models.SET_NULL,
        verbose_name="Основная игра",
        null=True,
        blank=True,
        related_name="main_profiles",
    )
    games = models.ManyToManyField(Game, related_name="extra_profiles", blank=True)

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return f"Profile {self.user_id}"
