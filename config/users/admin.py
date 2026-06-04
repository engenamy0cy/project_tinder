from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "is_staff", "is_active", "is_verified", "is_online", "last_activity")
    search_fields = ("username", "email")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("is_verified", "is_online", "last_activity")}),
    )
