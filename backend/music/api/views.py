from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, FileResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, SongStorageSerializers
from .models import SongStorage, UserStats, UserProgress
import mingus.core.notes as notes
import mingus.core.intervals as intervals
import mingus.core.chords as chords
import random
import json
from .functions import create_new_song, generate_audio, generate_interval_session, generate_chords_session, generate_progression_session, generate_melodies_session, generate_interval_progress_session, generate_progression_progress_session, create_interval_stats_object, create_progression_stats_object, create_chartdata, update_stats

#Authentication
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'user': user})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
Old login view

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})
'''


#Database communication for song storage
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_songs(request):
    user_id = request.user.id
    try:
        songs = SongStorage.objects.filter(user_id=user_id)
        serializer = SongStorageSerializers(songs, many=True)
        return Response(serializer.data)
    except SongStorage.DoesNotExist:
        return Response(status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_song(request):
    try:
        user = request.user

        serializer = SongStorageSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_song(request, song_id):
    try:
        user = request.user
        song = SongStorage.objects.get(pk=song_id, user=user)
        song.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    except (User.DoesNotExist, SongStorage.DoesNotExist):
        return Response({'error': 'User or song does not exist'}, status=status.HTTP_404_NOT_FOUND)

#Database communication for handling statistics
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(request):
    user_stats = {}
    user_id = request.user.id
    userProgress, created = UserProgress.objects.get_or_create(user_id=user_id)

    try:
        intervalStats = UserStats.objects.get(user_id=user_id, type='interval')
        intervalChart = create_chartdata(intervalStats.sessionStats)
        currentIntervalLevel = str(userProgress.intervalProgress + 1)

        user_stats.update({
                    'intervalSessionStats': intervalStats.sessionStats,
                    'intervalProgressStats': intervalStats.progressStats,
                    'currentIntervalLevel': currentIntervalLevel,
                    'intervalChart': intervalChart
                })
    except UserStats.DoesNotExist:  
        pass

    try:
        progressionStats = UserStats.objects.get(user_id=user_id, type='progression')
        currentProgressionLevel = str(userProgress.progressionProgress + 1)

        user_stats.update({
                    'progressionSessionStats': progressionStats.sessionStats,
                    'progressionProgressStats': progressionStats.progressStats,
                    'currentProgressionLevel': currentProgressionLevel,
                })
    except UserStats.DoesNotExist:  
        pass

    if user_stats:
        return JsonResponse(user_stats)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_stats(request):
    user_id = request.user.id
    
    data = json.loads(request.body)
    session = data['sessionStats']
    progress = data['progressStats']
    eartrainingType = data['type']
    stats, created = UserStats.objects.get_or_create(user_id=user_id, type=eartrainingType)


    if data['type'] == 'interval':
        if created:
            newSessionStats, newProgressStats = create_interval_stats_object()
            stats.sessionStats = newSessionStats
            stats.progressStats = newProgressStats
        else:
            newSessionStats = stats.sessionStats
            newProgressStats = stats.progressStats

        updatedSessionStats, updatedProgressStats = update_stats(eartrainingType, session, progress, newSessionStats, newProgressStats)
        stats.sessionStats = updatedSessionStats
        stats.progressStats = updatedProgressStats
    
    if data['type'] == 'progression':
        if created:
            newSessionStats, newProgressStats = create_progression_stats_object()
            stats.sessionStats = newSessionStats
            stats.progressStats = newProgressStats
        else:
            newSessionStats = stats.sessionStats
            newProgressStats = stats.progressStats

        updatedSessionStats, updatedProgressStats = update_stats(eartrainingType, session, progress, newSessionStats, newProgressStats)
        stats.sessionStats = updatedSessionStats
        stats.progressStats = updatedProgressStats
        
    stats.save()

    status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(status=status_code)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def update_interval_progress(request):
    user_id = request.user.id
    user_progress = get_object_or_404(UserProgress, user_id=user_id)
    user_progress.intervalProgress += 1
    user_progress.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def update_progression_progress(request):
    user_id = request.user.id
    user_progress = get_object_or_404(UserProgress, user_id=user_id)
    user_progress.progressionProgress += 1
    user_progress.save()
    return Response(status=status.HTTP_200_OK)

#Functionality for create music page
@api_view(['GET', 'POST'])    
@permission_classes([AllowAny]) 
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
        
        song, chords_out, ordered_chord_list, chord_obj_list = create_new_song(key, quality, length, additions)
        print(ordered_chord_list)
         
    output = {
        'song': song,
        'key': key,
        'quality': quality,
        'length': length,
        'chords': chords_out,
        'chordList': ordered_chord_list,
        'chord_objects': chord_obj_list,
    }

    return JsonResponse(output)
    

@api_view(['POST'])
@permission_classes([AllowAny]) 
def transpose(request):
    data = json.loads(request.body)
    transposed_song = {}
    transposed_chords = {}
    chords_list = {}
    ordered_chord_list = []
    interval = intervals.determine(data['oldKey'], data['key'], True)
    interval_number = intervals.measure(data['oldKey'], data['key'])

    #Create transposed song
    for verse_key, verse in data['song'].items():
        new_verse = {}

        for chord_key, chord in verse.items():
            #Transpose chord according to given interval
            new_root = intervals.from_shorthand(chord['root'], interval)
            new_addition = chord['addition']
            new_name = new_root + new_addition
            new_chord = chords.from_shorthand(new_name)

            #Add chord to ordered chord list
            ordered_chord_list.append(new_name)

            #Add chord to chord list if not already there
            if not new_name in chords_list:
                chords_list[new_name] = new_chord
            
            #Create chord object and append to verse
            temp_chord = {
                'addition': new_addition,
                'root': new_root,
                'name': [new_name],
                'chord': new_chord,
            }
            new_verse[chord_key] = temp_chord

        #Add verse to song
        transposed_song[verse_key] = new_verse

    chord_name_list = []
    #Create transposed chord list
    for chord in data['chords'].values():
        new_chord_numbers = [x + interval_number for x in chord]
        if new_chord_numbers[0] - 12 >= 60:
            new_chord_numbers = [x - 12 for x in new_chord_numbers]
        
        new_chord_names = []
        for n in new_chord_numbers:
            #c = Note()
            #c.from_int(n)
            n = n - 60 if n - 60 < 12 else n - 72
            c = notes.int_to_note(n, 'b')
            new_chord_names.append(c)
        print(new_chord_numbers)
        print(new_chord_names)
        print(chords.determine(new_chord_names, True))
        new_key = chords.determine(new_chord_names, True)[0]
        transposed_chords[new_key] = new_chord_numbers

        chord_name_list.append(new_chord_names)
    
    #Create transposed chord objects list
    new_chord_objects = [{'name': chords.determine(c, True, True, True), 'chord': c, 'root': c[0], 'addition': chords.determine(c, True, True, True)[0][len(c[0]):]} for c in chord_name_list]

    output = {
        'key': data['key'],
        'length': data['length'],
        'quality': data['quality'],
        'song': transposed_song,
        'chords': transposed_chords,
        'chordList': ordered_chord_list,
        'chord_objects': new_chord_objects,
    }

    return JsonResponse(output)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def get_audio(request):
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

#Functionality for eartraining page
@api_view(['POST'])
@permission_classes([AllowAny]) 
def get_interval(request):
    data = json.loads(request.body)
    intervals = [int(interval) for interval in data['intervals']]
    directions = data['directions']
    width = int(data['width'])
    length = int(data['length'])

    session_object = generate_interval_session(intervals, directions, width, length)
    response = JsonResponse(session_object)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_interval_progress_mode(request):
    user_id = request.user.id
    user_progress, created = UserProgress.objects.get_or_create(user_id=user_id)
    progress = user_progress.intervalProgress
    try:
        stats = UserStats.objects.get(user_id=user_id, type='interval')
        progressObject = stats.progressStats
        sessionBest = progressObject['levelStats'][str(progress + 1)]['bestScorePercent']
    except UserStats.DoesNotExist:
        progressObject = None
        sessionBest = 0
    
    session_object = generate_interval_progress_session(progress)
    session_object['progressInfo'] = progressObject
    session_object['sessionBest'] = int(sessionBest)
    response = JsonResponse(session_object)
    return response
        

@api_view(['POST'])
@permission_classes([AllowAny]) 
def get_chords(request):
    data = json.loads(request.body)
    chords_included = [int(n) for n in data['chords_included']]
    style = int(data['style'])
    width = int(data['width'])
    length = int(data['length'])
    inversions = [int(inversion) for inversion in data['inversions']]
    if inversions:
        inversions[0] = 0
    else:
        inversions = [0]

    session_object = generate_chords_session(chords_included, style, width, length, inversions)
    response = JsonResponse(session_object)
    return response

@api_view(['POST'])
@permission_classes([AllowAny]) 
def get_progressions(request):
    data = json.loads(request.body)
    progressions_included = int(data['progressions_included'])
    #style = int(data['style']) - To implement
    start = int(data['start'])
    length = int(data['length'])
    progression_length = int(data['progression_length'])
    inversions = [int(inversion) for inversion in data['inversions']]
    if inversions:
        inversions[0] = 0
    else:
        inversions = [0]
    
    session_object = generate_progression_session(progressions_included, start, length, progression_length, inversions)
    response = JsonResponse(session_object)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_progression_progress_mode(request):
    user_id = request.user.id
    user_progress, created = UserProgress.objects.get_or_create(user_id=user_id)
    progress = user_progress.progressionProgress
    try:
        stats = UserStats.objects.get(user_id=user_id, type='progression')
        progressObject = stats.progressStats
        sessionBest = progressObject['levelStats'][str(progress + 1)]['bestScorePercent']
    except UserStats.DoesNotExist:
        progressObject = None
        sessionBest = 0
    
    session_object = generate_progression_progress_session(progress)
    session_object['progressInfo'] = progressObject
    session_object['sessionBest'] = int(sessionBest)
    response = JsonResponse(session_object)
    return response
        


@api_view(['POST'])
@permission_classes([AllowAny]) 
def get_melodies(request):
    data = json.loads(request.body)
    notes_included = int(data['melodies_included'])
    difficulty = int(data['difficulty'])
    start = int(data['start'])
    length = int(data['length'])
    melody_length = int(data['melody_length'])

    
    session_object = generate_melodies_session(notes_included, difficulty, start, length, melody_length)
    response = JsonResponse(session_object)
    return response

