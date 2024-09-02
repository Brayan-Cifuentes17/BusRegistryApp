document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('form');
    if (form) {
        register(form);
    }

    const searchForm = document.getElementById('formSearch');
    if (searchForm) {
        search(searchForm);
    }
});

function register(form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const code = document.getElementById('code').value;
        const hour = document.getElementById('hour').value;

        const timeRegex = /^([01]\d|2[0-3]):([0 -5]\d)$/;
        if (!timeRegex.test(hour)) {
            alert('Ingrese una hora valida en el formato HH:MM');
            return; 
        }
        const data = { code, hour };

        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Éxito:', data);
            const message = document.getElementById("message");
            if (message) {
                if (data == "1") {
                    message.innerText = "Añadido con éxito";
                } else if (data == "2") {
                    message.innerText = "Actualizado con éxito";
                }
            } else {
                const htmldiv = document.getElementById("contenedor");
                const element = document.createElement("span");
                element.id = 'message';
                if (data == "1") {
                    element.innerText = "Añadido con éxito";
                } else if (data == "2") {
                    element.innerText = "Actualizado con éxito";
                }
                htmldiv.appendChild(element);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

function search(form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const code = document.getElementById('code').value;

        fetch(`http://localhost:3000/search/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Éxito:', data);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = ''; 

            if (data.found) {
                const resultText = `Placa: ${data.vehicle.code} - Hora: ${data.vehicle.hour} - Editado: ${data.vehicle.edits} veces`;
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar';
                deleteButton.addEventListener('click', () => {
                    deleteVehicle(data.vehicle.code);
                });

                resultDiv.innerHTML = resultText;
                resultDiv.appendChild(deleteButton);
            } else {
                resultDiv.innerHTML = 'Bus no encontrado.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

function deleteVehicle(code) {
    fetch(`http://localhost:3000/delete/${code}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log('Éxito:', data);
        if (data === 'eliminado') {
            alert('Bus eliminado con éxito.');
            document.getElementById('formSearch').reset();
        } else {
            alert('Error al eliminar el bus.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
