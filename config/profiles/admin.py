from django.contrib import admin

from .models import (
    Age,
    Avatar,
    Bio,
    City,
    Country,
    FirstName,
    Game,
    Gender,
    Hours_in_game,
    LastName,
    Profiles,
)

admin.site.register(FirstName)
admin.site.register(LastName)
admin.site.register(Bio)
admin.site.register(Age)
admin.site.register(Hours_in_game)
admin.site.register(Gender)
admin.site.register(City)
admin.site.register(Country)
admin.site.register(Avatar)
admin.site.register(Game)


@admin.register(Profiles)
class ProfilesAdmin(admin.ModelAdmin):
    list_display = ("user", "main_game")
    filter_horizontal = ("games",)
