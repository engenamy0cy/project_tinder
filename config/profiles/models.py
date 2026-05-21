from django.conf import settings
from django.db import models


class FirstName(models.Model):
    first_name = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name


class LastName(models.Model):
    last_name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.last_name


class Bio(models.Model):
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.bio[:50] if self.bio else ""


class Age(models.Model):
    age = models.IntegerField()

    def __str__(self):
        return str(self.age)


class Hours_in_game(models.Model):


    hours = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.hours)


class Gender(models.Model):
    GEN = [
        ("Man", "Мужской"),
        ("Woman", "Женский"),
        ("dont_indicate", "Не указывать"),
    ]
    gender = models.CharField(
        max_length=20,
        choices=GEN,
        default="dont_indicate",
        verbose_name="Пол",
    )

    def __str__(self):
        return self.gender


class City(models.Model):
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.city


class Country(models.Model):
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.country


class Avatar(models.Model):
    avatar = models.ImageField(upload_to="profile_photos/", blank=True, null=True)

    def __str__(self):
        if self.avatar:
            return self.avatar.name
        return "None"


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

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        primary_key=True,
    )
    first_name = models.ForeignKey(
        FirstName, on_delete=models.PROTECT, verbose_name="Имя", null=True, blank=True
    )
    last_name = models.ForeignKey(
        LastName, on_delete=models.PROTECT, verbose_name="Фамилия", null=True, blank=True
    )
    bio = models.ForeignKey(
        Bio, on_delete=models.PROTECT, verbose_name="Биография", null=True, blank=True
    )
    age = models.ForeignKey(
        Age, on_delete=models.PROTECT, verbose_name="Возраст", null=True, blank=True
    )
    hours_in_game = models.ForeignKey(
        Hours_in_game,
        on_delete=models.PROTECT,
        verbose_name="Часы в игре",
        null=True,
        blank=True,
    )
    gender = models.ForeignKey(
        Gender,
        on_delete=models.PROTECT,
        verbose_name="Пол",
        null=True,
        blank=True,
    )
    city = models.ForeignKey(
        City, on_delete=models.PROTECT, verbose_name="Город", null=True, blank=True
    )
    country = models.ForeignKey(
        Country, on_delete=models.PROTECT, verbose_name="Страна", null=True, blank=True
    )
    avatar = models.ForeignKey(
        Avatar, on_delete=models.PROTECT, verbose_name="Аватар", null=True, blank=True
    )
    main_game = models.ForeignKey(
        Game,
        on_delete=models.PROTECT,
        verbose_name="Основная игра",
        null=True,
        blank=True,
        related_name="main_profiles",
    )
    games = models.ManyToManyField(Game, related_name="extra_profiles", blank=True)

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name.first_name} {self.last_name.last_name}"
        return f"Profile {self.user_id}"
