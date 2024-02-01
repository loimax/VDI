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
        url: URL_API + '/profile',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            window.location = "/dashboard";
        }
    });
}

// DIVERS
function createBlockquoteWithIcon(title, text, iconClass) {
    var blockquote = $('<blockquote>').addClass('blockquote text-center');
    var h1 = $('<h1>').addClass('mb-0').text(title);
    var p = $('<p>').html('<i>' + text + '</i>');
    var icon = $('<i>').addClass(iconClass);
    blockquote.append(h1, p, icon);
    return blockquote;
}