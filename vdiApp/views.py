# vm_management/views.py
from django.contrib.auth.decorators import login_required 
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from .models import Template, VM
from django.contrib.auth.forms import AuthenticationForm #add this
import test
from django.contrib.auth.models import User
from django.contrib.auth.decorators import user_passes_test

url = []
conn = test.conn

def is_admin(user):
    return True
    return user.username in admin_list
         

def is_prof(user):
    return True
    return user.username in prof_list

def is_student(user):
    return True
    return user.username in student_list


def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        print(form.errors)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"Connecté en tant que {username}.")
                return redirect("student_page")
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe invalide.")
        
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe invalide.")
            
    form = AuthenticationForm()
    return render(request, "login.html")

@login_required
@user_passes_test(is_admin)
def admin_page(request):
    templates = Template.objects.all()
    vms = VM.objects.all()
    users = User.objects.all()
    
    if request.method == 'POST':
        if 'create_template' in request.POST:
            template_name = request.POST.get('template_name')
            template_description = request.POST.get('template_description')
            if template_description == '':
                 template_description = "Pas de description."
            template = Template.objects.create(
                name=template_name, 
                description=template_description
                )
            messages.success(request, 'Le Template a été créé avec succès.')
        
        elif 'delete_template' in request.POST:
            template_id = request.POST['template_id']
            template = Template.objects.get(pk=template_id)
            template.delete()
            messages.success(request, 'Le Template a été supprimé avec succès.')

        elif 'create_start_vm' in request.POST:
            template_name = request.POST.get('template_name')
            vm_name = f"vm{VM.objects.count()}_from_{template_name}_template"
            template_id = request.POST.get('template_id')
            vm_template = Template.objects.get(id=template_id)
            vm = VM.objects.create(
                name=vm_name, 
                template=vm_template, 
                templat_id=template_id
                )
            vm.save()
            test.create_instance(conn, vm_name, vm_template)
            messages.success(request, 'La VM a été créée avec succès.')
            url.append(test.get_console_url(conn, vm_name))
            return redirect("console_page")
        
        return redirect("admin_page")
    
    return render(request, 'admin_page.html', {'templates': templates, 'vms': vms})

@login_required
@user_passes_test(is_prof)
def professor_page(request):
    templates = Template.objects.all()
    vms = VM.objects.all()
    users = User.objects.all()

    if request.method == "POST":
        if 'create_vm_out' in request.POST:
            template_name = request.POST.get('template_name')
            vm_name = request.POST.get('vm_name')
            username = request.POST.get('username')
            vm_template = Template.objects.get(name=template_name)
            user = User.objects.get(username=username)
            vm = VM.objects.create(
                name=vm_name, 
                template=vm_template, 
                templat_id=vm_template.id,
                user=user
                )
            vm.save()
            messages.success(request, 'La VM a été créée avec succès.')

        elif 'delete_vm' in request.POST:
            vm_name = request.POST.get('vm_name')
            vm = VM.objects.get(name=vm_name)
            vm.delete()
            messages.success(request, "L'utilisateur a été supprimé avec succès.")

        elif 'create_user' in request.POST:
            firstname = request.POST.get('firstname')
            lastname = request.POST.get('lastname')
            email = request.POST.get('email')
            password = request.POST.get('password')

            # Vérifier si l'utilisateur existe déjà par adresse e-mail
            existing_user = User.objects.filter(email=email).first()

            if existing_user:
                messages.error(request, "Cet utilisateur existe déjà.")
            else:
                # Créer l'utilisateur uniquement s'il n'existe pas encore
                user = User.objects.create_user(
                    username=f"{firstname}.{lastname}",
                    email=email,
                    password=password,
                    first_name=firstname,
                    last_name=lastname
                )
                messages.success(request, "L'utilisateur a été créé avec succès.")

        elif 'delete_user' in request.POST:
            username = request.POST.get('username')
            user = User.objects.get(username=username)
            user.delete()
            messages.success(request, "L'utilisateur a été supprimé avec succès.")
        
        return redirect("professor_page")

    return render(request, 'professor_page.html', {'templates': templates, 'vms': vms, 'users': users})

@login_required
@user_passes_test(is_student)
def student_page(request):
    
    is_authenticated = request.user.is_authenticated
    username = request.user.username
    first_name = request.user.first_name
    last_name = request.user.last_name
    
    context = {
        'is_authenticated': is_authenticated,
    }
    
    templates = Template.objects.all()
    vms = VM.objects.all()
    users = User.objects.all()

    if request.method == "POST":
        if 'create_start_vm' in request.POST:
            template_name = request.POST.get('template_name')
            vm_name = f"vm_from_{template_name}_template"
            template_id = request.POST.get('template_id')
            vm_template = Template.objects.get(id=template_id)
            vm = VM.objects.create(name=vm_name, template=vm_template, templat_id=template_id)
            test.create_instance(conn, vm_name, vm_template)
            messages.success(request, 'La VM a été créée avec succès.')

            test.create_instance(conn, vm_name, vm_image="kali")
            url.append(test.get_console_url(conn, vm_name))
            return redirect("console_page")

        return redirect('student_page')

    context = {
            'templates': templates, 
            'vms': vms,
            'is_authenticated': is_authenticated,
            'username': username,
            'user_last_name': last_name,
            'user_first_name': first_name,
        }
    
    return render(request, 'student_page.html', context)

@login_required
def data_page(request):
    vms = VM.objects.all()
    templates = Template.objects.all()
    users = User.objects.all()

    template_data = [{'name': template.name, 'id': template.id, 'description': template.description, 'created_at': template.created_at, 'last_interaction': template.last_interaction} for template in templates]
    vm_data = [{'name': vm.name, 'id': vm.id, 'template': vm.template.name, 'template_id': vm.templat_id, 'created_at': vm.created_at, 'last_interaction': vm.last_interaction} for vm in vms]
    user_data = [{'username': user.username, 'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name} for user in users]
    data_json = {'templates': template_data, 'vms': vm_data, 'users': user_data}

    return JsonResponse(data_json)

@login_required
def console_page(request):
    return redirect(url.pop())

@login_required
def dashboard_page(request):
     return render(request, 'dashboard.html')