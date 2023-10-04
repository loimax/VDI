# vm_management/views.py
from django.contrib.auth.decorators import login_required  # Import login_required decorator
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth import authenticate
from .models import Template, VM

# Vue pour la page d'administration
def admin_page(request):
    templates = Template.objects.all()
    vms = VM.objects.all()
    
    if request.method == 'POST':
        if 'create_template' in request.POST:
            template_name = request.POST.get('template_name')
            template_description = request.POST.get('template_description')
            template = Template.objects.create(name=template_name, description=template_description)
            messages.success(request, 'Le Template a été créé avec succès.')

        elif 'create_vm' in request.POST:
            vm_name = request.POST.get('vm_name')
            vm_template_id = request.POST.get('template')
            vm_template = Template.objects.get(id=vm_template_id)
            
            vm = VM.objects.create(name=vm_name, template=vm_template)
            messages.success(request, 'La VM a été créée avec succès.')

        elif 'start_vm' in request.POST:
            print(request.POST)
            vm_name = request.POST.get('vm_name')
            print(f"Starting {vm_name}")

        return redirect('admin_page')
    
    return render(request, 'admin_page.html', {'templates': templates, 'vms': vms})

def professor_page(request):
    templates = Template.objects.all()
    return render(request, 'professor_page.html', {'templates': templates})

def student_page(request):
    templates = Template.objects.all()
    return render(request, 'student_page.html', {'templates': templates})

def data_page(request):
    vms = VM.objects.all()
    templates = Template.objects.all()

    template_data = [{'name': template.name, 'id': template.custom_id, 'description': template.description} for template in templates]
    vm_data = [{'name': vm.name, 'template': vm.template.name} for vm in vms]
    data_json = {'templates': template_data, 'vms': vm_data}

    return JsonResponse(data_json)