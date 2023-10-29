from django import forms
from .models import VirtualMachine
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

class AddVMForm(forms.ModelForm):
    class Meta:
        model = VirtualMachine
        fields = ['name', 'status'] 

class CreateVMForm(forms.Form):
    name = forms.CharField(max_length=100, label='Nom de la machine virtuelle')

    def clean_name(self):
        name = self.cleaned_data.get('name')
        return name
