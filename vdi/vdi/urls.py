"""vdi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from vdiApp import views

urlpatterns = [
    # URL pour la page d'administration
    path('admin/', views.admin_page, name='admin_page'),
    # URL pour la page des professeurs
    path('professor/', views.professor_page, name='professor_page'),
    # URL pour la page des étudiants
    path('student/', views.student_page, name='student_page'),
    # Vous pouvez ajouter d'autres URL ici en fonction de vos besoins
    path('data/', views.data_page, name='data_page'),
]