# vm_management/models.py
from django.db import models
from django.contrib.auth.models import User
import uuid
from django.db.models.signals import pre_save
from django.dispatch import receiver

class Template(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    custom_id = models.CharField(max_length=36, unique=True, editable=False)  # Champ pour l'identifiant unique

    def __str__(self):
        return self.name
    
@receiver(pre_save, sender=Template)
def generate_custom_id(sender, instance, *args, **kwargs):
    if not instance.custom_id:
        instance.custom_id = str(uuid.uuid4())
    
class VM(models.Model):
    name = models.CharField(max_length=100)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    # owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # Ajoutez d'autres champs pour décrire la VM
