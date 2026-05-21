from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Is_online, Is_verified, Last_activity, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "is_staff", "is_active")
    search_fields = ("username", "email")


admin.site.register(Is_verified)
admin.site.register(Is_online)
admin.site.register(Last_activity)
