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