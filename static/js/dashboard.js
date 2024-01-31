function getTemplates() {
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/template',
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            var templates = response;
            templatesDiv = $('#templates-div');
            templates.forEach(addTemplateToDOM);
        },
        error: function (error) {
            alert('Erreur d\'obtention d\'informations de templates');
        }
    });
}

async function createVmFromTemplate(templateId) {
    showLoadingModal(); 
    $.ajax({
        type: 'POST',
        url: 'https://api.insa-cvl.com/vm/create',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ template_id: templateId }),
        xhrFields: {
            withCredentials: true
        },
        success: async function (response) {
            try {
                var output = await checkIfVmAlive(templateId);
                while (output !== 1) {
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    output = await checkIfVmAlive(templateId);
                }
            } catch (error) {
                alert(error);
                hideLoadingModal(); 
            }
            hideLoadingModal(); 
            location.reload();
        },
        error: function (error) {
            alert('Erreur de création de la VM');
            hideLoadingModal(); 
        }
    });
}

function redirectToVmViewer(templateId) {
    showLoadingModal();
    $.ajax({
        type: 'GET',
        url: 'https://api.insa-cvl.com/vm/url/template/' + templateId,
        contentType: 'application/json;charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            hideLoadingModal();
            var vncUrl = response.url;
            window.location = "/viewer?vncUrl=" + encodeURIComponent(vncUrl);
        },
        error: function (error) {
            alert('Erreur de d\'ouverture de la VM');
            hideLoadingModal(); 
        }
    })
}

async function openVm(templateId) {
    try {
        var output = await checkIfVmAlive(templateId);
        if (output == 1) {
            redirectToVmViewer(templateId);
        }
    } catch (error) {
        alert(error);
    }
}

async function deleteVm(templateId) {
    try {
        var output = await checkIfVmAlive(templateId);
        if (output == 1) {
            showLoadingModal();
            $.ajax({
                type: 'DELETE',
                url: 'https://api.insa-cvl.com/vm/delete',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({ template_id: templateId }),
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

async function getVmStatus(templateId) {
    try {
        var output = await checkIfVmAlive(templateId);
        updateButtons(templateId, output);
    } catch (error) {
        alert(error);
    }
}