from django.contrib import admin

from .models import Match, Message, Swipe

admin.site.register(Swipe)
admin.site.register(Match)
admin.site.register(Message)
