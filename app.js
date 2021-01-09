const URL = 'http://localhost:3000/contacs';
// fetch(URL)
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));



window.onload = function () {
    let tbody = document.querySelector('#tbody');
    fetch(URL)
        .then(res => res.json())
        .then(data => {
            data.forEach(contact => {
                //console.log(contact.name);
                createelement(contact, tbody);
            });
        })
        .catch(error => {
            console.log(error);
        })
    let saveContact = document.getElementById('saveContact');
    saveContact.addEventListener('click', () => {
        createContact();
    })
}

function createContact() {
    let nameFiled = document.getElementById('nameFiled');
    let emailFiled = document.getElementById('emailFiled');
    let phoneFiled = document.getElementById('phoneFiled');
    // console.log(nameFiled.value);
    // console.log(emailFiled.value);
    // console.log(phoneFiled.value);

    let contact = {
        name: nameFiled.value,
        email: emailFiled.value,
        phone: phoneFiled.value
    }
    // console.log(contact);
    fetch(URL, {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(res => res.json())
        .then(data => {
            let tbody = document.querySelector('#tbody');
            //console.log(data);
            createelement(data, tbody);

            nameFiled.value = '';
            emailFiled.value = '';
            phoneFiled.value = '';
        })
        .catch(err => console.log(err))
}

function createelement(contact, parentelement) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.innerHTML = contact.name;
    tr.appendChild(tdName);

    const tdEmail = document.createElement('td');
    tdEmail.innerHTML = contact.email ? contact.email : 'N/A';
    tr.appendChild(tdEmail);

    const tdPhone = document.createElement('td');
    tdPhone.innerHTML = contact.phone ? contact.phone : 'N/A';
    tr.appendChild(tdPhone);

    const tdActions = document.createElement('td');
    const tdEditButton = document.createElement('button');
    tdEditButton.className = 'btn btn-warning mx-1';
    tdEditButton.innerHTML = 'Edit';
    tdEditButton.addEventListener('click', () => {
        let mainModal = $('#contactEditModal')
        mainModal.modal('toggle')
        let editName = document.getElementById('edit-name');
        let editEmail = document.getElementById('edit-email');
        let editPhone = document.getElementById('edit-phone');
        editName.value = contact.name;
        editEmail.value = contact.email ? contact.email : '';
        editPhone.value = contact.phone ? contact.phone : '';

        let updatebtn = document.getElementById('updateContact');

        //console.log(updateData);
        updatebtn.addEventListener('click', () => {
            let updateData = {
                name: editName.value,
                email: editEmail.value,
                phone: editPhone.value
            }
            fetch(`${URL}/${contact.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updateData),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    tdName.innerHTML = data.name;
                    // console.log(data.name);
                    tdEmail.innerHTML = data.email;
                    tdPhone.innerHTML = data.phone;
                    mainModal.modal('hide');
                })
                .catch(error => console.log(error))

        })
    })
    tdActions.appendChild(tdEditButton);

    const tdDeleteButton = document.createElement('button');
    tdDeleteButton.className = 'btn btn-danger';
    tdDeleteButton.innerHTML = 'Delete';
    tdDeleteButton.addEventListener('click', () => {
        //console.log(contact);
        fetch(`${URL}/${contact.id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                parentelement.removeChild(tr)
            })
            .catch(err => console.log(err))
    })
    tdActions.appendChild(tdDeleteButton);
    tr.appendChild(tdActions);
    parentelement.appendChild(tr);
}