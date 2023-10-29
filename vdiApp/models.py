from django.utils import timezone
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
import uuid

class Template(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    last_interaction = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=100, null=True)
    password = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    last_interaction = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username

class VM(models.Model):
    name = models.CharField(max_length=100)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    templat_id = models.IntegerField(default=None, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    last_interaction = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.name

    def remove_vm(self):
        self.delete()
