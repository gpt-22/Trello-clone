from django.db import models


class Board(models.Model):

    title = models.CharField(max_length=128, verbose_name='Заголовок')

    class Meta:
        verbose_name = 'Доска'
        verbose_name_plural = 'Доски'

    def __str__(self):
        return str(self.title)


class List(models.Model):

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')
    title = models.CharField(max_length=128, verbose_name='Заголовок')

    class Meta:
        verbose_name = 'Список'
        verbose_name_plural = 'Списки'

    def __str__(self):
        return str(self.title)


class Card(models.Model):

    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=128, verbose_name='Заголовок')
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(verbose_name='Описание', null=True, blank=True)
    expiration = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'

    def __str__(self):
        return str(self.title)


class Mark(models.Model):

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='marks')
    title = models.CharField(max_length=128, verbose_name='Заголовок')

    class Meta:
        verbose_name = 'Метка'
        verbose_name_plural = 'Метки'

    def __str__(self):
        return str(self.title)


class Checklist(models.Model):

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='checklists')
    title = models.CharField(max_length=128, verbose_name='Заголовок')

    class Meta:
        verbose_name = 'Чек-лист'
        verbose_name_plural = 'Чек-листы'

    def __str__(self):
        return str(self.title)


class ChecklistItem(models.Model):

    checklist = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name='items')
    text = models.TextField(verbose_name='Текст задачи')

    class Meta:
        verbose_name = 'Задача чек-листа'
        verbose_name_plural = 'Задачи чек-листов'

    def __str__(self):
        return str(self.text)
