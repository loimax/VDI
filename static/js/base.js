function checkIfVmAliveAdmin(vmId) {
    return new Promise(function (resolve, reject) {
        showLoadingCardModal(vmId);   
        $.ajax({
            type: 'GET',
            url: 'https://api.insa-cvl.com/vm/status/id/' + vmId,
            contentType: 'application/json;charset=UTF-8',
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                if (response.vm_state == "1" && response.status == "ACTIVE") {
                    hideLoadingCardModal(vmId);
                    resolve(1); 
                } else {
                    hideLoadingCardModal(vmId);
                    resolve(0);
                }
            },
            error: function (error) {
                reject("Erreur d'obtention d'informations de la VM");
            }
        });
    });
}

function showLoadingCardModal(id) {
    $("#" + id + "-loading-modal").css("display", "block");
}

function hideLoadingCardModal(id) {
    $("#" + id + "-loading-modal").css("display", "none");
}

function createLdsDefaultContainer(id) {
    var ldsDefaultContainer = $('<div>').addClass('lds-default-container');
    var ldsDefaultSpinner = createLdsDefaultSpinner(id);
    ldsDefaultContainer.append(ldsDefaultSpinner);
    return ldsDefaultContainer;
}

function createLdsDefaultSpinner(id) {
    var ldsDefaultSpinner = $('<div>')
    .addClass('lds-default')
    .attr('id', id + '-loading-modal')
    .css('display', 'none');            
    for (var i = 0; i < 12; i++) {
        var childDiv = $('<div>');
        ldsDefaultSpinner.append(childDiv);
    }
    return ldsDefaultSpinner;
}

function checkIfVmAlive(id) {
    return new Promise(function (resolve, reject) {
        showLoadingCardModal(id);   
        $.ajax({
            type: 'GET',
            url: 'https://api.insa-cvl.com/vm/status/template/' + id,
            contentType: 'application/json;charset=UTF-8',
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                if (response.vm_state == "1" && response.status == "ACTIVE") {
                    hideLoadingCardModal(id);
                    resolve(1); 
                } else {
                    hideLoadingCardModal(id);
                    resolve(0);
                }
            },
            error: function (error) {
                reject("Erreur d'obtention d'informations de la VM");
            }
        });
    });
}

function togglePageClicks(enabled) {
    if (enabled) {
        document.body.style.pointerEvents = 'auto';
    } else {
        document.body.style.pointerEvents = 'none';
    }
}

function showLoadingModal() {
    $('#loadingModal').modal('show');
    togglePageClicks(false);
}

function hideLoadingModal() {
    $('#loadingModal').modal('hide');
    togglePageClicks(true);
}

function showAlertModal(title, message) {
    var modalTitle = document.getElementById('alertModalLabel');
    var modalMessage = document.getElementById('alertModalMessage');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
}

function logout() {
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/logout',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            if (response.cas === true) {
                window.location = "https://cas.insa-cvl.fr/cas/logout?service=https://api.insa-cvl.com"
            } 
            setTimeout(function () {
                    window.location = "/login?success=" + encodeURIComponent("Déconnecté avec succès");

            }, 1000);
        },
        error: function (error) {
            alert('Erreur lors de la déconnexion');
        }
    });
}


function redirectToLogin() {
    window.location.href = '/login';
}

function updateConnectionStatus(isConnected) {
    if (isConnected) {
        $('#userInfo').show();
    } else {
        $('#userInfo').hide();
    }
}

function getUserProfile() {
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/profile',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var user = response;
            $('#tt-email').text('Email: ' + user.email);
            $('#tt-name').text('Prénom: ' + user.first_name);
            $('#tt-surname').text('Nom: ' + user.last_name);
            $('#tt-role').text('Role: ' + user.role);
            $('#tt-id').text('ID: ' + user.id);
            $('#welcome-name').text('Bienvenue, ' + user.first_name);

            var userRole = user.role;
            if (userRole === 'prof') {
                $('#profBtn').show();
            }
            if (userRole === 'admin') {
                $('#adminBtn').show();
            }
            updateConnectionStatus(true);
        },
        error: function (error) {
            updateConnectionStatus(false);
            window.location = "/login?error=" + encodeURIComponent('Vous%20n\'êtes%20pas%20connecté.%20Redirection....');
        }
    });
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
        url: 'https://api.insa-cvl.com/createuser',
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

function changePassword(userId, newPassword, newPassword2) {
    $.ajax({
        type: 'POST',
        url: 'https://api.insa-cvl.com/updatepasswordpa',
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
        url: 'https://api.insa-cvl.com/updaterole',
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

function deleteUser(userId) {
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

function addUserToTableProf(user) {
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

function addUserToTableAdmin(user) {
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

    var changePasswordButton = $('<button>')
        .addClass("btn btn-light")
        .text('Changer le rôle')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#selectRoleModal')
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

function addVMToDOM(vm) {
    var vmCard = createVmCard(vm);
    vmsDiv.append(vmCard);
}

function createVmForm(vm) {  
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


function createVmCard(vm) {
    var vmCard = $('<div>').addClass('card').css('width', '18rem').attr('id', vm.id);
    var cardBody = createVmForm(vm);
    vmCard.append(cardBody);
    return vmCard;
}