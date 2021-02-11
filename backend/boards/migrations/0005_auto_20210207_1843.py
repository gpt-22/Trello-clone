# Generated by Django 3.1.5 on 2021-02-07 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0004_auto_20210119_1738'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='position',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='checklist',
            name='position',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='checklistitem',
            name='position',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='list',
            name='position',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
