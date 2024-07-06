document.addEventListener('DOMContentLoaded', function() {
    var agregarBtn = document.getElementById('agregarBtn');
    var formularioABMForm = document.getElementById('formularioABMForm');
    var tipoPersonaSelect = document.getElementById('tipoPersona');
    var campoDNI = document.getElementById('campoDNI');
    var campoPaisOrigen = document.getElementById('campoPaisOrigen');

    if (agregarBtn && formularioABMForm && tipoPersonaSelect) {
        agregarBtn.addEventListener('click', function() {
            mostrarFormularioABM();
            formularioABMForm.onsubmit = agregarElemento;
        });
        tipoPersonaSelect.addEventListener('change', mostrarCamposSegunTipoPersona);
    } else {
        console.error('404');
    }

    cargarDatosDesdeAPI();
});

function mostrarCamposSegunTipoPersona() {
    var tipoPersona = document.getElementById('tipoPersona').value;
    if (tipoPersona === 'ciudadano') {
        document.getElementById('campoDNI').style.display = 'block';
        document.getElementById('campoPaisOrigen').style.display = 'none';
        document.getElementById('dni').required = true;
        document.getElementById('paisOrigen').required = false;
    } else if (tipoPersona === 'extranjero') {
        document.getElementById('campoDNI').style.display = 'none';
        document.getElementById('campoPaisOrigen').style.display = 'block';
        document.getElementById('dni').required = false;
        document.getElementById('paisOrigen').required = true;
    } else {
        document.getElementById('campoDNI').style.display = 'none';
        document.getElementById('campoPaisOrigen').style.display = 'none';
        document.getElementById('dni').required = false;
        document.getElementById('paisOrigen').required = false;
    }
}

function limpiarFormularioABM() {
    document.getElementById('persona-id').innerText = ''; // Limpiar el campo de ID
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('fechaNacimiento').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('paisOrigen').value = '';
    document.getElementById('tipoPersona').value = '';
    document.getElementById('tipoPersona').disabled = false;
    document.getElementById('dni').disabled = false;
    document.getElementById('paisOrigen').disabled = false;
    mostrarCamposSegunTipoPersona(); // Reset fields display based on type selection
}

function mostrarFormularioABM() {
    limpiarFormularioABM();
    document.querySelector('.listadoPersonas').style.display = 'none';
    document.getElementById('formularioABM').style.display = 'block';
    document.getElementById('tituloFormulario').innerText = 'Agregar Persona'; // Por defecto, 'Agregar Persona'
    document.getElementById('tipoPersona').disabled = false; // Habilitar por defecto
}

function ocultarFormularioABM() {
    document.getElementById('formularioABM').style.display = 'none';
    document.querySelector('.listadoPersonas').style.display = 'block';
}

function cancelarAccion() {
    ocultarFormularioABM();
}

function mostrarSpinner() {
    document.getElementById('spinner-container').style.display = 'block';
}

function ocultarSpinner() {
    document.getElementById('spinner-container').style.display = 'none';
}

function mostrarFormularioYLista(lista) {
    var tableBody = document.querySelector('#tablaPersonas tbody');
    tableBody.innerHTML = '';

    lista.forEach(persona => {
        var row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.fechaNacimiento}</td>
            ${persona.dni ? `<td>${persona.dni}</td>` : `<td>-</td>`}
            ${persona.paisOrigen ? `<td>${persona.paisOrigen}</td>` : `<td>-</td>`}
            <td><button onclick="modificarPersona(${persona.id})">Modificar</button></td>
            <td><button onclick="eliminarPersona(${persona.id})">Eliminar</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}

async function agregarElemento(event) {
    event.preventDefault();
    mostrarSpinner();
    
    try {
        const tipoPersona = document.getElementById('tipoPersona').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const dni = document.getElementById('dni').value;
        const paisOrigen = document.getElementById('paisOrigen').value;

        validarNombre(nombre);
        validarApellido(apellido);
        validarFechaNacimiento(fechaNacimiento);
        
        let nuevoElemento = { nombre, apellido, fechaNacimiento };

        if (tipoPersona === 'ciudadano') {
            validarDNI(dni);
            nuevoElemento.dni = parseInt(dni, 10);
        } else if (tipoPersona === 'extranjero') {
            validarPaisOrigen(paisOrigen);
            nuevoElemento.paisOrigen = paisOrigen;
        } else {
            throw new Error("Debe seleccionar un tipo de persona válido.");
        }

        const response = await fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoElemento)
        });

        if (response.status === 200) {
            const data = await response.json();
            nuevoElemento.id = data.id;
            personas.push(nuevoElemento);
            mostrarFormularioYLista(personas);
            ocultarSpinner();
            ocultarFormularioABM();
        } else {
            ocultarSpinner();
            alert("No se pudo realizar la operación.");
        }
    } catch (error) {
        ocultarSpinner();
        alert(error.message);
    }
}

function modificarPersona(id) {
    var persona = personas.find(p => p.id === id);
    if (!persona) {
        alert('No se encontró la persona.');
        return;
    }

    limpiarFormularioABM(); // Limpiar los campos antes de mostrar el formulario
    document.getElementById('tituloFormulario').innerText = 'Modificar Persona';
    
    // Cargar datos en el formulario
    document.getElementById('nombre').value = persona.nombre;
    document.getElementById('apellido').value = persona.apellido;
    document.getElementById('fechaNacimiento').value = persona.fechaNacimiento;
    document.getElementById('tipoPersona').value = persona.dni ? 'ciudadano' : 'extranjero';
    document.getElementById('tipoPersona').disabled = true;

    if (persona.dni) {
        document.getElementById('dni').value = persona.dni;
        document.getElementById('campoDNI').style.display = 'block';
        document.getElementById('campoPaisOrigen').style.display = 'none';
        document.getElementById('dni').disabled = true; // Bloquear DNI
    } else {
        document.getElementById('paisOrigen').value = persona.paisOrigen;
        document.getElementById('campoDNI').style.display = 'none';
        document.getElementById('campoPaisOrigen').style.display = 'block';
        document.getElementById('paisOrigen').disabled = true; // Bloquear País de Origen
    }

    // Bloquear ID
    document.getElementById('persona-id').innerText = persona.id;
    formularioABMForm.onsubmit = actualizarElemento;
    document.querySelector('.listadoPersonas').style.display = 'none';
    document.getElementById('formularioABM').style.display = 'block';
}

async function actualizarElemento(event) {
    event.preventDefault();
    mostrarSpinner();

    const id = document.getElementById('persona-id').innerText;
    const tipoPersona = document.getElementById('tipoPersona').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const dni = document.getElementById('dni').value;
    const paisOrigen = document.getElementById('paisOrigen').value;

    try {
        validarNombre(nombre);
        validarApellido(apellido);
        validarFechaNacimiento(fechaNacimiento);

        let elementoActualizado = { id, nombre, apellido, fechaNacimiento };

        if (tipoPersona === 'ciudadano') {
            validarDNI(dni);
            elementoActualizado.dni = parseInt(dni, 10);
        } else if (tipoPersona === 'extranjero') {
            validarPaisOrigen(paisOrigen);
            elementoActualizado.paisOrigen = paisOrigen;
        } else {
            throw new Error("Debe seleccionar un tipo de persona válido.");
        }

        const response = await fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elementoActualizado)
        });

        if (response.status === 200) {
            // Manejar respuesta de texto plano
            const data = await response.text();
            if (data === 'Registro Actualizado') {
                // Actualizar el elemento en la lista local
                let index = personas.findIndex(p => p.id === parseInt(id, 10));
                if (index !== -1) {
                    personas[index] = elementoActualizado;
                }
                mostrarFormularioYLista(personas);
                ocultarSpinner();
                ocultarFormularioABM();
            } else {
                throw new Error("Respuesta inesperada del servidor.");
            }
        } else {
            ocultarSpinner();
            alert("No se pudo realizar la operación.");
        }
    } catch (error) {
        ocultarSpinner();
        alert(error.message);
    }
}
/*ELIMINACION*/

function eliminarPersona(id) {
    var persona = personas.find(p => p.id === id);
    if (!persona) {
        alert('No se encontró la persona.');
        return;
    }

    // Cargar datos en el formulario para mostrar antes de eliminar
    document.getElementById('tituloFormulario').innerText = 'Eliminar Persona';
    document.getElementById('persona-id').innerText = persona.id;
    document.getElementById('nombre').value = persona.nombre;
    document.getElementById('apellido').value = persona.apellido;
    document.getElementById('fechaNacimiento').value = persona.fechaNacimiento;
    document.getElementById('tipoPersona').value = persona.dni ? 'ciudadano' : 'extranjero';
    document.getElementById('tipoPersona').disabled = true;

    if (persona.dni) {
        document.getElementById('dni').value = persona.dni;
        document.getElementById('campoDNI').style.display = 'block';
        document.getElementById('campoPaisOrigen').style.display = 'none';
        document.getElementById('dni').disabled = true;
    } else {
        document.getElementById('paisOrigen').value = persona.paisOrigen;
        document.getElementById('campoDNI').style.display = 'none';
        document.getElementById('campoPaisOrigen').style.display = 'block';
        document.getElementById('paisOrigen').disabled = true;
    }

    formularioABMForm.onsubmit = confirmarEliminarElemento;
    document.querySelector('.listadoPersonas').style.display = 'none';
    document.getElementById('formularioABM').style.display = 'block';
}

async function confirmarEliminarElemento(event) {
    event.preventDefault();
    mostrarSpinner();

    const id = document.getElementById('persona-id').innerText;

    try {
        const body = JSON.stringify({ id: parseInt(id, 10) });
        console.log('Request body:', body);

        const response = await fetch('https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (response.status === 200) {
            // Eliminar el elemento de la lista local
            personas = personas.filter(p => p.id !== parseInt(id, 10));
            mostrarFormularioYLista(personas);
            ocultarSpinner();
            ocultarFormularioABM();
        } else {
            const errorMessage = await response.text();
            console.error(`Error ${response.status}: ${errorMessage}`);
            ocultarSpinner();
            alert("No se pudo realizar la operación.");
        }
    } catch (error) {
        console.error(error);
        ocultarSpinner();
        alert(error.message);
    }
}
