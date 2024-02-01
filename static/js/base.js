// VMS ACTIVITY

function checkIfVmAliveAdmin(vmId) {
    return new Promise(function (resolve, reject) {
        showLoadingCardModal(vmId);   
        $.ajax({
            type: 'GET',
            url: URL_API +'/vm/status/id/' + vmId,
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

function checkIfVmAlive(id) { // showLoadingCardModal | hideLoadingCardModal
    return new Promise(function (resolve, reject) {
        showLoadingCardModal(id);   
        $.ajax({
            type: 'GET',
            url: URL_API + '/vm/status/template/' + id,
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

// CONNEXION / STATUS

function showAlertModal(title, message) { //
    var modalTitle = document.getElementById('alertModalLabel');
    var modalMessage = document.getElementById('alertModalMessage');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
}

function logout() { //
    $.ajax({
        type: 'GET',
        url: URL_API + '/logout',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            if (response.cas === true) {
                window.location = "https://cas.insa-cvl.fr/cas/logout?service=" + URL_API
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


function redirectToLogin() { //
    window.location.href = '/login';
}

function updateConnectionStatus(isConnected) { //
    if (isConnected) {
        $('#userInfo').show();
    } else {
        $('#userInfo').hide();
    }
}

function getUserProfile() { // updateConnectionStatus
    $.ajax({
        type: 'GET',
        url: URL_API + '/profile',
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

// SPINNERS
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

function createLdsDefaultContainer(id) { // createLdsDefaultSpinner
    var ldsDefaultContainer = $('<div>').addClass('lds-default-container');
    var ldsDefaultSpinner = createLdsDefaultSpinner(id);
    ldsDefaultContainer.append(ldsDefaultSpinner);
    return ldsDefaultContainer;
}

function togglePageClicks(enabled) {
    if (enabled) {
        document.body.style.pointerEvents = 'auto';
    } else {
        document.body.style.pointerEvents = 'none';
    }
}

function showLoadingCardModal(id) {
    $("#" + id + "-loading-modal").css("display", "block");
}

function hideLoadingCardModal(id) {
    $("#" + id + "-loading-modal").css("display", "none");
}

function showLoadingModal() { // togglePageClicks
    $('#loadingModal').modal('show');
    togglePageClicks(false);
}

function hideLoadingModal() { // togglePageClicks
    $('#loadingModal').modal('hide');
    togglePageClicks(true);
}

// DIVERS
function createBlockquote(title, text) {
    var blockquote = $('<blockquote>').addClass('blockquote text-center');
    var h1 = $('<h1>').addClass('mb-0').text(title);
    var p = $('<p>').html('<i>' + text + '</i>');
    blockquote.append(h1, p);
    return blockquote;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}