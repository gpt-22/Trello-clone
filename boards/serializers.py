from rest_framework.serializers import ModelSerializer

from .models import Board, List, Card, Mark, Checklist, ChecklistItem


class ChecklistItemSerializer(ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = ['id', 'text']


class ChecklistSerializer(ModelSerializer):
    items = ChecklistItemSerializer(many=True, read_only=True)
    class Meta:
        model = Checklist
        fields = ['id', 'title', 'items']


class MarkSerializer(ModelSerializer):
    class Meta:
        model = Mark
        fields = ['id', 'title']


class CardSerializer(ModelSerializer):
    marks = MarkSerializer(many=True, read_only=True)
    checklists = ChecklistSerializer(many=True, read_only=True)
    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'marks', 'checklists', 'expiration', 'created_at']


class ListSerializer(ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = List
        fields = ['id', 'title', 'cards']


class BoardSerializer(ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)
    class Meta:
        model = Board
        fields = ['id', 'title', 'lists']
