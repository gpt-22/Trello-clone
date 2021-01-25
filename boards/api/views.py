from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from boards.api.serializers import (
    BoardSerializer,
    ListSerializer,
    CardSerializer,
    MarkSerializer,
    ChecklistSerializer
)
from boards.models import Board, List, Card, Mark, Checklist


class BoardViewSet(ModelViewSet):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    # permission_classes = [IsAuthenticated]


class ListViewSet(ModelViewSet):

    queryset = List.objects.all()
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.filter(board=self.kwargs['board_pk'])


class CardViewSet(ModelViewSet):

    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def get_queryset(self):
        return Card.objects.filter(list=self.kwargs['list_pk'])


class MarkViewSet(ModelViewSet):

    queryset = Mark.objects.all()
    serializer_class = MarkSerializer

    def get_queryset(self):
        return Mark.objects.filter(card=self.kwargs['card_pk'])


class ChecklistViewSet(ModelViewSet):

    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer

    def get_queryset(self):
        return Checklist.objects.filter(card=self.kwargs['card_pk'])
