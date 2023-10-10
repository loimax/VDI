# vm_management/views.py
from django.contrib.auth.decorators import login_required 
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth import authenticate
from .models import Template, VM, User
import test


url = []
conn = test.conn

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
            
            vm = VM.objects.create(name=vm_name, template=vm_template, templat_id=vm_template_id)
            messages.success(request, 'La VM a été créée avec succès.')

        elif 'start_vm' in request.POST:
            vm_name = request.POST.get('vm_name')
            print(f"Starting {vm_name}")
            #envoyer sur une page en mode "chargement vm"
            test.create_instance(conn, vm_name, vm_image="kali")
            url.append(test.get_console_url(conn, vm_name))
            #envoyer sur VNC
            return redirect("console_page")
        return redirect("admin_page")
    return render(request, 'admin_page.html', {'templates': templates, 'vms': vms})

def professor_page(request):
    templates = Template.objects.all()
    vms = VM.objects.all()

    return render(request, 'professor_page.html', {'templates': templates, 'vms': vms})

def student_page(request):
    templates = Template.objects.all()
    vms = VM.objects.all()

    if request.method == "POST":
        if 'instance_vm' in request.POST:
            print(request.POST)
            vm_name = request.POST.get('vm_name')
            vm_template_id = request.POST.get('template')
            vm_template = Template.objects.get(id=vm_template_id)
            existing_vm = VM.objects.filter(template_id=vm_template_id).first()

            if existing_vm:
                print(f"Une VM existe déjà pour le template {existing_vm.template.name}")
            else:
                vm = VM.objects.create(name=vm_name, template=vm_template, templat_id=vm_template_id)
                messages.success(request, 'La VM a été instanciée avec succès.')
                print(f"Instance de {vm_name} en utilisant le modèle {vm_template.name}")

        elif 'start_vm' in request.POST:
            print(request.POST)
            vm_name = request.POST.get('vm_name')
            print(f"Starting {vm_name}")

        return redirect('student_page')
    
    return render(request, 'student_page.html', {'templates': templates, 'vms': vms})

def data_page(request):
    vms = VM.objects.all()
    templates = Template.objects.all()
    users = User.objects.all()

    template_data = [{'name': template.name, 'id': template.id, 'description': template.description} for template in templates]
    vm_data = [{'name': vm.name, 'id': vm.id, 'template': vm.template.name, 'template_id': vm.templat_id, 'created_at': vm.created_at, 'last_interaction': vm.last_interaction} for vm in vms]
    user_data = [{'name': user.name, 'id': user.id, 'email': user.email} for user in users]
    data_json = {'templates': template_data, 'vms': vm_data}

    return JsonResponse(data_json)


def console_page(request):
    return redirect(url.pop())