from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, FileResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import UserSerializer
import mingus.core.notes as notes
import mingus.core.intervals as intervals
import mingus.core.chords as chords
import mingus.core.scales as scales
from mingus.containers import Note
import random
import json
from .functions import create_new_song, generate_audio

#Authentication
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user':serializer.data})
    return Response(serializer.errors, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})

#Functionality
@csrf_exempt      
def create_song(request):
    keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Db', 'Eb', 'Gb', 'Ab', 'Bb']
    if request.method == 'GET':
        key = request.GET.get('key', None)
        quality = request.GET.get('quality', None)
        length = request.GET.get('length', None)

        if not key:
            key = random.choice(keys)
        if not length: 
            length = 1
        if not quality:
            quality = 'Major'
        
        length = int(length)
        
        song, chords_out = create_new_song(key, quality, length)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        key = data['key']
        quality = data['quality']
        length = int(data['length'])
        additions = data['additions']
        print(additions)

        if not key:
            key = random.choice(keys)
        
        song, chords_out, ordered_chord_list = create_new_song(key, quality, length, additions)
        print(ordered_chord_list)
         
    output = {
        'song': song,
        'key': key,
        'quality': quality,
        'length': length,
        'chords': chords_out,
        'chordList': ordered_chord_list,
    }

    return JsonResponse(output)
    

@csrf_exempt
def transpose(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        transposed_song = {}
        transposed_chords = {}
        chords_list = {}
        interval = intervals.determine(data['oldKey'], data['key'], True)

        #Create transposed song
        for verse_key, verse in data['song'].items():
            new_verse = {}
            for chord_key, chord in verse.items():
                new_root = intervals.from_shorthand(chord['root'], interval)
                new_addition = chord['addition']
                new_name = new_root + new_addition
                new_chord = chords.from_shorthand(new_name)

                if not new_name in chords_list:
                    chords_list[new_name] = new_chord
                
                temp_chord = {
                    'addition': new_addition,
                    'root': new_root,
                    'name': [new_name],
                    'chord': new_chord,
                }
                new_verse[chord_key] = temp_chord
            transposed_song[verse_key] = new_verse

        #Create transposed chord list
        for key, chord in chords_list.items():
            chord_numbers = [int(Note(note)) for note in chord]
            for index, number in enumerate(chord_numbers):
                former_index = index - 1
                if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]):
                    chord_numbers[index] += 12
            transposed_chords[key] = chord_numbers

        output = {
            'key': data['key'],
            'length': data['length'],
            'quality': data['quality'],
            'song': transposed_song,
            'chords': transposed_chords
        }

        return JsonResponse(output)

@csrf_exempt
def get_audio(request):
    if request.method == 'POST':
        data=json.loads(request.body)
        song = data['song']
        chord_numbers = data['chords']
        tempo = int(data['tempo'])
        tempo = 6 - tempo
        if data['variation']:
            variation = data['variation']
        else: 
            variation = 0
        if data['base']:
            base = data['base']
        else:
            base = 0


        mp3_bytes, song_obj = generate_audio(song, chord_numbers, variation, base, tempo)

        response = HttpResponse(mp3_bytes, content_type='audio/mpeg')
        return response