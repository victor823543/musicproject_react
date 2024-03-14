from django.contrib.auth.models import User
from api.models import SongStorage
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class SongStorageSerializers(serializers.ModelSerializer):
    class Meta:
        model = SongStorage
        fields = ['id', 'created', 'song', 'title']