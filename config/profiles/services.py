"""
вся алгометрическая логика работа с несколькими моделями расчеты валидация требующая доступ к бд
"""

from typing import List,Set
from django.db.models import Prefetch
from profiles.models import LastName, FirstName, Age, City, Country, Gender, Avatar, Bio
from .models import Profiles

class ProfileSelectionService:
    #сервис для выбора блюд по выбранной категории и набору продуктов
    """
    метод класса который не получает автоматически ссылку на экземпляр класса(self) и не получает ссылку на сам класс
    формально ведет себя как обычная функция но логически принадлежит самому классу и вызывается через класс или его экземпляр
    """ 
    @staticmethod

    def get_possible_profiles(category_id:int, product_ids:List[int]) -> (List[Profiles]):

    #возвращает список блюд заданной категории
    #для которых все ингридиенты содержатся в пределах product_id
    #получаем блюда нужной категории с предварительной загрузкой ингридиентов
        profiles = Profiles.objects.filter(category_id = category_id).prefetch_related(
            Prefetch('products',queryset= Profiles.objects.only('id'))
        )
        product_set = set(product_ids)
        result = []
        for profile in profiles:
            profile_product_set = set(profile.products.value_list('id',flat=True))
            if profile_product_set.issubset(product_set):
                result.append(profile)
        return result
    
    @staticmethod
    #для формы вывода возвращаем все категории с их продуктами
    def get_product_and_category():
        return FirstName.objects.prefetch_related('products').all() 