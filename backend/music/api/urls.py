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
]

urlpatterns = format_suffix_patterns(urlpatterns)