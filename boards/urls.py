from django.urls import path

from .views import *


urlpatterns = [
    path('', BoardView.as_view(), name='board'),
]
