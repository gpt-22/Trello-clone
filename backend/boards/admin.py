from django.contrib import admin

from boards.models import *


admin.site.register(Board)
admin.site.register(List)
admin.site.register(Card)
admin.site.register(Mark)
admin.site.register(Checklist)
admin.site.register(ChecklistItem)
