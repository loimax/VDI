function regenerateUrl(templateId) {
    return new Promise(function (resolve, object) {
        $.ajax({
            type: 'GET',
            url: 'https://api.insa-cvl.com/vm/regenerate_url/' + templateId,
            contentType: 'application/json;charset=UTF-8',
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                if (response) {
                    resolve(1);
                }
                else {
                    resolve(0);
                }
            },
            error: function (error) {
                reject("Erreur de regénération de du token");
            }
        })
    })
}

async function refreshVnc() { // regenerateUrl
    try {
        var output = await regenerateUrl(templateId);
        if (output == 1) {
            location.reload();
        }
    } catch (error) {
        alert(error);
    }
}

function getUrl(templateId) { 
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: 'https://api.insa-cvl.com/vm/url/template/' + templateId,
            contentType: 'application/json;charset=UTF-8',
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                vncUrl = response.url;
                if (vncUrl) {
                    resolve(1);
                }
                else {
                    resolve(0);
                }
            },
            error: function (error) {
                reject("Erreur d'obtention de l'URL");
            }
        })
    })
}

function displayVNCViewer(vncUrl) {
    var iframe = document.createElement('iframe');
    iframe.src = vncUrl;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";
    document.getElementById('vncViewerContainer').appendChild(iframe);
}

async function openVm(vncUrl, templateId) { // displayVNCViewer | getUrl
    try {
        var output = await getUrl(templateId);
        if (output == 1) {
            $('#openVncUrl').on('click', function () {
                window.open(vncUrl);
            });
            displayVNCViewer(vncUrl);
        }
    } catch (error) {
        alert(error);
    }
}

function checkIfVmActive(templateId) {
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/vm/active/' + templateId,
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            return 1;
        },
        error: function (error) {
            alert('Erreur d\'obtention de l\'activité de la VM');
            return 0;
        }
    });
}