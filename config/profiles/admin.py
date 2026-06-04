from django.contrib import admin
from .models import Game, Profiles

admin.site.register(Game)

@admin.register(Profiles)
class ProfilesAdmin(admin.ModelAdmin):
    list_display = ("user", "first_name", "last_name", "age", "gender", "city", "main_game")
    search_fields = ("user__username", "first_name", "last_name", "city")
    filter_horizontal = ("games",)
