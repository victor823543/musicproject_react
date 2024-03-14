from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class SongStorage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateField(auto_now_add=True)
    song = models.JSONField()
    title = models.CharField(max_length=80, null=True, blank=True)