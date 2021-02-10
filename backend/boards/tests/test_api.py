import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from boards.api.serializers import BoardSerializer
from boards.models import Board


class BoardsAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create(username='TestUserName')
        self.test_board_1 = Board.objects.create(title='Test Board 1')
        self.test_board_2 = Board.objects.create(title='Test Board 2')

    def test_get(self):
        serializer_data = BoardSerializer([self.test_board_1, self.test_board_2], many=True).data
        url = reverse('board-list')
        response = self.client.get(url)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_post(self):
        url = reverse('board-list')
        print(url)
        data = {
            'title': 'New Test Board'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, response.data['id'])
        print('POST:', Board.objects.all())

    def test_put(self):
        url = reverse('board-detail', args=(self.test_board_2.id,))
        data = {
            'title': 'New Test Board (Updated)'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(data['title'], response.data['title'])
        print('PUT:', Board.objects.all())

    def test_delete(self):
        count_before = Board.objects.count()
        url = reverse('board-detail', args=(self.test_board_1.id,))
        self.client.force_login(self.user)
        response = self.client.delete(url)
        count_after = Board.objects.count()
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(count_before - 1, count_after)
