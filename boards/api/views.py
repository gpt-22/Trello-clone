from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from boards.api.serializers import BoardSerializer, ListSerializer, CardSerializer
from boards.models import Board, List, Card


class BoardViewSet(ModelViewSet):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    # permission_classes = [IsAuthenticated]


class ListViewSet(ModelViewSet):

    queryset = List.objects.all()
    serializer_class = ListSerializer


class CardViewSet(ModelViewSet):

    queryset = Card.objects.all()
    serializer_class = CardSerializer
