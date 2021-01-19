from django.shortcuts import render
from django.views import View
from rest_framework.viewsets import ModelViewSet

from .models import List, Card, Board
from .serializers import BoardSerializer, ListSerializer, CardSerializer


class BoardView(View):

    def get(self, request):
        context = {}
        return render(request, 'board.html', context)


class BoardViewSet(ModelViewSet):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class ListViewSet(ModelViewSet):

    queryset = List.objects.all()
    serializer_class = ListSerializer


class CardViewSet(ModelViewSet):

    queryset = Card.objects.all()
    serializer_class = CardSerializer
