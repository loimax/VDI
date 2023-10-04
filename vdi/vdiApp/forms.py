from django import forms
from .models import VirtualMachine

class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

class AddVMForm(forms.ModelForm):
    class Meta:
        model = VirtualMachine
        fields = ['name', 'status']  # Ajoutez tous les champs nécessaires pour la création de VM

class CreateVMForm(forms.Form):
    name = forms.CharField(max_length=100, label='Nom de la machine virtuelle')

    def clean_name(self):
        name = self.cleaned_data.get('name')
        # Vous pouvez ajouter des validations personnalisées ici, par exemple, vérifier si le nom existe déjà dans la base de données.
        return name
