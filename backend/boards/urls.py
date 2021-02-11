from django.conf.urls import url
from django.urls import path, include
from rest_framework_nested import routers

from boards.api.views import (
    BoardViewSet,
    ListViewSet,
    CardViewSet,
    MarkViewSet,
    ChecklistViewSet
)


router = routers.SimpleRouter()
router.register(r'boards', BoardViewSet, basename='boards')
## generates:
# /boards/
# /boards/{pk}/

boards_router = routers.NestedSimpleRouter(router, r'boards', lookup='board')
boards_router.register(r'lists', ListViewSet, basename='lists')
## generates:
# /boards/{boards_pk}/lists/
# /boards/{boards_pk}/lists/{lists_pk}/

lists_router = routers.NestedSimpleRouter(boards_router, r'lists', lookup='list')
lists_router.register(r'cards', CardViewSet, basename='cards')
## generates:
# /boards/{boards_pk}/lists/{lists_pk}/cards
# /boards/{boards_pk}/lists/{lists_pk}/cards/{card_pk}

cards_router = routers.NestedSimpleRouter(lists_router, r'cards', lookup='card')
cards_router.register(r'marks', MarkViewSet, basename='marks')
cards_router.register(r'checklists', ChecklistViewSet, basename='checklists')
#...


api_urlpatterns = [
    url('', include(router.urls)),
    url('', include(boards_router.urls)),
    url('', include(lists_router.urls)),
    url('', include(cards_router.urls)),
]

urlpatterns = [
    path('api/', include(api_urlpatterns))
]
