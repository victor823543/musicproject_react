from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class SongStorage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateField(auto_now_add=True)
    song = models.JSONField()
    title = models.CharField(max_length=80, null=True, blank=True)

class UserStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, default='interval')
    sessionStats = models.JSONField(null=True)
    progressStats = models.JSONField(null=True)

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    intervalProgress = models.IntegerField(default=0)
    melodyProgress = models.IntegerField(default=0)
    chordProgress = models.IntegerField(default=0)
    progressionProgress = models.IntegerField(default=0)