from django.contrib.auth.models import User
from api.models import SongStorage, UserStats, UserProgress
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class SongStorageSerializers(serializers.ModelSerializer):
    class Meta:
        model = SongStorage
        fields = ['id', 'created', 'song', 'title']
    
class UserStatsSerializers(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = ['type', 'sessionStats', 'progressStats']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserProgress
        fields = ['intervalProgress', 'melodyProgress', 'chordProgress', 'progressionProgress']