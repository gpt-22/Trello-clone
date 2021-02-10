from rest_framework.serializers import ModelSerializer

from boards.models import Board, List, Card, Mark, Checklist, ChecklistItem


class ChecklistItemSerializer(ModelSerializer):

    class Meta:
        model = ChecklistItem
        fields = ['id', 'text', 'position']


class ChecklistSerializer(ModelSerializer):
    items = ChecklistItemSerializer(many=True, required=False)

    class Meta:
        model = Checklist
        fields = ['id', 'title', 'items', 'position']


class MarkSerializer(ModelSerializer):

    class Meta:
        model = Mark
        fields = ['id', 'card', 'title']


class CardSerializer(ModelSerializer):
    marks = MarkSerializer(many=True, required=False)
    checklists = ChecklistSerializer(many=True, required=False)

    class Meta:
        model = Card
        fields = ['id', 'list', 'position', 'title', 'description', 'marks', 'checklists', 'expiration', 'created_at']


class ListSerializer(ModelSerializer):
    cards = CardSerializer(many=True, required=False)

    class Meta:
        model = List
        fields = ['id', 'board', 'position', 'title', 'cards']


class BoardSerializer(ModelSerializer):
    lists = ListSerializer(many=True, required=False)

    def create(self, validated_data):
        return Board.objects.create(**validated_data)

    class Meta:
        model = Board
        fields = ['id', 'title', 'lists']
