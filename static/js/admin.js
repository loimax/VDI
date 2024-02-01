async function deleteVmAdmin(id) { // showLoadingModal | checkIfVmAliveAdmin | hideLoadingModal
    try {
        var output = await checkIfVmAliveAdmin(id);
        if (output == 1) {
            showLoadingModal();
            $.ajax({
                type: 'DELETE',
                url: URL_API + '/vm/delete_admin',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({ vm_id: id }),
                xhrFields: {
                    withCredentials: true
                },
                success: function (response) {
                    hideLoadingModal();
                    location.reload();
                },
                error: function (error) {
                    alert('Erreur de suppression de la VM');
                    hideLoadingModal(); 
                }
            });
        }
    } catch (error) {
        alert(error);
        hideLoadingModal(); 
    }
}

function changePassword(userId, newPassword, newPassword2) {
    $.ajax({
        type: 'POST',
        url: URL_API + '/updatepasswordpa',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ user_id: userId, new_password: newPassword, new_password2: newPassword2 }),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            alert('Mot de passe changé avec succès!');
        },
        error: function (error) {
            alert('Erreur lors du changement de mot de passe. L\'utilisateur est peut-être du CAS.');
        }
    });
}

function changeRole(userId, role) {
    $.ajax({
        type: 'POST',
        url: URL_API + '/updaterole',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ user_id: userId, role: role }),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            alert('Role mis à jour !');
            location.reload();
        },
        error: function (error) {
            alert('Erreur lors de la mise à jour du rôle.');
        }
    })
}

function createUser() {
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();

    var userData = {
        first_name: firstname,
        last_name: lastname,
        email: email
    };

    $.ajax({
        type: 'POST',
        url: URL_API + '/createuser',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(userData),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            alert('Utilisateur créé avec succès! Mot de passe: ' + response.password);
            location.reload();
        },
        error: function (error) {
            alert('Erreur lors de la création de l\'utilisateur.');
        }
    });
}

function deleteUser(userId) { // 
    $.ajax({
        type: 'DELETE',
        url: URL_API + '/deleteuser',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ user_id: userId }),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            alert('Utilisateur supprimé avec succès!');
            location.reload();
        },
        error: function (error) {
            alert('Erreur lors de la suppression de l\'utilisateur.');
        }
    });
}

function addUserToTableAdmin(user) { // deleteUser
    var row = $('<tr>');
    row.append($('<td>').attr('scope', 'row').text(user.id));
    row.append($('<td>').text(user.first_name));
    row.append($('<td>').text(user.last_name));
    row.append($('<td>').text(user.email));
    row.append($('<td>').text(user.role));
    
    var changePasswordButton = $('<button>')
        .addClass("btn btn-light")
        .text('Changer le mot de passe')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#editUserModal')
        .attr('data-user-id', user.id)
        .on('click', function() {
            var userId = $(this).data('user-id');
            $('#edit-user-id').val(userId);
        });

    row.append($('<td>').append(changePasswordButton));

    var selectRoleButton = $('<button>')
        .addClass("btn btn-light")
        .text('Changer le rôle')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#selectRoleModal')
        .attr('data-user-id', user.id)
        .on('click', function() {
            var userId = $(this).data('user-id');
            $('#edit-user-id').val(userId);
        });

    row.append($('<td>').append(selectRoleButton));

    var deleteUserButton = $('<button>')
        .addClass("btn btn-light")
        .text('Supprimer l\'utilisateur')
        .on('click', function() {
            deleteUser(user.id);
        });

    row.append($('<td>').append(deleteUserButton));

    $('#users-table tbody').append(row);
}

function getUsers() { // addUserToTableAdmin
    $.ajax({
        type: 'GET',
        url: URL_API + '/users',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var users = response;
            usersDiv = $('#users-div');
            users.forEach(addUserToTableAdmin);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations d\'users');
        }
    });
}

// TEMPLATES

function createTemplateForm(template) {
    var infoContainer = $('<div>').addClass('card-body bg-secondary text-center');
    var icon = $('<i>').addClass('bi bi-card-heading');
    var img = $('<div>').append(icon);
    var cardBody = $('<div>').addClass('card-body');
    var cardTitle = $('<h5>').addClass('card-title').html('<em>' + template.name + "</em>");

    cardBody.append(cardTitle);
    infoContainer.append(img, cardBody);

    return infoContainer;
}

function createTemplateCard(template) { // createTemplateForm
    var templateCard = $('<div>').addClass('card').css('width', '18rem').attr('id', template.id);
    var cardBody = createTemplateForm(template);
    templateCard.append(cardBody);
    return templateCard;
}

function addTemplateToDOM(template) { // createTemplateCard
    var templateCard = createTemplateCard(template);
    $('#templates-div').append(templateCard);
}

function getTemplates() { // addTemplateToDOM
    $.ajax({
        type: 'GET',
        url: URL_API + '/template',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var templates = response;
            templates.forEach(addTemplateToDOM);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations de templates');
        }
    });
}

// VMS

function createVmForm(vm) {  // deleteVmAdmin
    var infoContainer = $('<div>').addClass('card-body bg-secondary text-center');
    var icon = $('<i>').addClass('bi bi-pc-display');
    var img = $('<div>').addClass('text-center').append(icon);
    var cardBody = $('<div>').addClass('card-body');
    var cardTitle = $('<h5>').addClass('card-title').html('Nom: <em>' + vm.template_name + "</em>");
    var cardText1 = $('<p>').addClass('card-text').html('Propriétaire: <em>' + vm.first_name + ' ' + vm.last_name + "</em>");
    var listGroup = $('<ul>').addClass('list-group list-group-flush');
    var listItems = [
        $('<li>').addClass('list-group-item bg-secondary').html('Template ID: <em>' + vm.template_id + "</em>"),
        $('<li>').addClass('list-group-item bg-secondary').html('User ID: <em>' + vm.users_id + "</em>"),
        $('<li>').addClass('list-group-item bg-secondary').html('Date de création: <em>' + vm.creationDate + "</em>")
    ];

    var cardBody2 = $('<div>').addClass('card-body');
    var cardLink1 = $('<button>').addClass('btn btn-danger').text('Supprimer').on('click', function () {
        deleteVmAdmin(vm.id);
    });

    listGroup.append(listItems);
    cardBody2.append(cardLink1);
    cardBody.append(cardTitle, cardText1);
    
    var ldsDefaultContainer = createLdsDefaultContainer(vm.id);
    infoContainer.append(img, cardBody, listGroup, cardBody2, ldsDefaultContainer);

    return infoContainer;
}


function createVmCard(vm) { // createVmForm
    var vmCard = $('<div>').addClass('card').css('width', '18rem').attr('id', vm.id);
    var cardBody = createVmForm(vm);
    vmCard.append(cardBody);
    return vmCard;
}

function addVMToDOM(vm) { // createVmCard
    var vmCard = createVmCard(vm);
    $('#vms-div').append(vmCard);
}

function getVms() { // addVMToDOM
    $.ajax({
        type: 'GET',
        url: URL_API + '/vm',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var vms = response;
            vmsDiv = $('#vms-div');
            vms.forEach(addVMToDOM);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations des VMs des users');
        }
    });
}