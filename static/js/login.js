function updateAlert(message) {
    var existingAlert = document.querySelector('#alert-message');
    existingAlert.textContent = message;
    existingAlert.innerHTML += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
'<span aria-hidden="true">x</span></button>';
    existingAlert.style.display = 'block';
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
            window.location = "/dashboard";
        }
    });
}