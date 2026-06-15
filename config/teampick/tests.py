from django.test import TestCase
from django.contrib.auth import get_user_model
from profiles.models import Game, Profiles
from teampick.services import SearchService

User = get_user_model()

class SearchTest(TestCase):
    def test_search_filters_game_age_gender_hours(self):
        g, _ = Game.objects.get_or_create(game="cs2")
        viewer = User.objects.create_user("viewer", "v@t.com", "p")
        match_user = User.objects.create_user("found", "f@t.com", "p")
        other = User.objects.create_user("other", "o@t.com", "p")

        Profiles.objects.filter(user=match_user).update(
            main_game=g,
            age=22,
            gender="Man",
            hours_in_game=500,
        )
        Profiles.objects.filter(user=other).update(
            main_game=g,
            age=30,
            gender="Woman",
            hours_in_game=100,
        )

        cards = SearchService.search(
            viewer.id,
            game="cs2",
            age=22,
            gender="Man",
            hours_min=400,
            hours_max=600,
        )
        self.assertEqual(len(cards), 1)
        self.assertEqual(cards[0]["user_id"], match_user.id)

    def test_yes_no_message_flow(self):
        a = User.objects.create_user("a", "a@t.com", "p")
        b = User.objects.create_user("b", "b@t.com", "p")

        yes = SearchService.perform_action(a.id, b.id, "yes")
        self.assertTrue(yes["ok"])
        self.assertFalse(yes["match"])

        bad_msg = SearchService.perform_action(a.id, b.id, "message", text="hi")
        self.assertFalse(bad_msg["ok"])

        no = SearchService.perform_action(a.id, b.id, "no")
        self.assertTrue(no["ok"])

        SearchService.perform_action(b.id, a.id, "yes")
        SearchService.perform_action(a.id, b.id, "yes")
        msg = SearchService.perform_action(a.id, b.id, "message", text="Привет!")
        self.assertTrue(msg["ok"])
