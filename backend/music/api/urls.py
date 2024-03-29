from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('signup/', views.signup),
    #path('login/', views.login),
    path('create/', views.create_song),
    path('transpose/', views.transpose),
    path('audio/', views.get_audio),
    path('interval/', views.get_interval),
    path('interval/progress/', views.get_interval_progress_mode),
    path('progression/progress/', views.get_progression_progress_mode),
    path('interval/progress/update/', views.update_interval_progress),
    path('progression/progress/update/', views.update_progression_progress),
    path('chord/', views.get_chords),
    path('progression/', views.get_progressions),
    path('melody/', views.get_melodies),
    path('userstats/', views.get_user_stats),
    path('update/stats/', views.update_user_stats),
    path('songs/', views.user_songs),
    path('songs/store/', views.store_song),
    path('songs/<int:song_id>/delete/', views.delete_song),
]

#urlpatterns = format_suffix_patterns(urlpatterns)  