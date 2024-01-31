async function deleteVmProf(id) { // showLoadingModal | hideLoadingModal | checkIfVmAliveAdmin
    try {
        var output = await checkIfVmAliveAdmin(id);
        if (output == 1) {
            showLoadingModal();
            $.ajax({
                type: 'DELETE',
                url: 'https://api.insa-cvl.com/vm/delete_admin',
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

function deleteUser(userId) { // 
    $.ajax({
        type: 'DELETE',
        url: 'https://api.insa-cvl.com/deleteuser',
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

function addUserToTableProf(user) { // deleteUser
    var row = $('<tr>');
    row.append($('<td>').attr('scope', 'row').text(user.id));
    row.append($('<td>').text(user.first_name));
    row.append($('<td>').text(user.last_name));
    row.append($('<td>').text(user.email));
    
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

    var deleteUserButton = $('<button>')
        .addClass("btn btn-light")
        .text('Supprimer l\'utilisateur')
        .on('click', function() {
            deleteUser(user.id);
        });

    row.append($('<td>').append(deleteUserButton));

    $('#users-table tbody').append(row);
}

function getMyUsers() { // addUserToTableProf
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/myusers',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var users = response;
            users.forEach(addUserToTableProf);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations de mes users');
        }
    });
}

async function deleteVmAdmin(id) { // showLoadingModal | checkIfVmAliveAdmin | hideLoadingModal
    try {
        var output = await checkIfVmAliveAdmin(id);
        if (output == 1) {
            showLoadingModal();
            $.ajax({
                type: 'DELETE',
                url: 'https://api.insa-cvl.com/vm/delete_admin',
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

function addVMToDOM(vm) { // createVmCard | vmsDiv
    var vmCard = createVmCard(vm);
    $('#vms-div').append(vmCard);
}

function getVms() { // addVMToDOM
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/myvmsusers',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var vms = response;
            vms.forEach(addVMToDOM);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations des VMs des users');
        }
    });
}