from django.shortcuts import render
from django.views import View


class BoardView(View):

    def get(self, request):
        context = {}
        return render(request, 'board.html', context)
