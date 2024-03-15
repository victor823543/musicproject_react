from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('create/', views.create_song),
    path('transpose/', views.transpose),
    path('audio/', views.get_audio),
    path('interval/', views.get_interval),
    path('chord/', views.get_chords),
    path('progression/', views.get_progressions),
    path('melody/', views.get_melodies),
    path('users/<int:user_id>/songs/', views.user_songs),
    path('users/<int:user_id>/store/', views.store_song),
    path('users/<int:user_id>/songs/<int:song_id>/delete/', views.delete_song)
]

#urlpatterns = format_suffix_patterns(urlpatterns)  