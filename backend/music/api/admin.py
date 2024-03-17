from django.contrib import admin
from .models import UserProgress, UserStats

# Register your models here.
admin.site.register(UserStats)
admin.site.register(UserProgress) 
