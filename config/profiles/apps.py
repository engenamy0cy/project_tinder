from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "profiles"

    def ready(self):
        from profiles.profile_payload import ensure_default_games

        try:
            ensure_default_games()
        except Exception:
            pass
