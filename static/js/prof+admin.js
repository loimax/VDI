
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
    vmsDiv.append(vmCard);
}
