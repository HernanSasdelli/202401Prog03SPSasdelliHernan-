document.addEventListener('DOMContentLoaded', function() {
    var agregarBtn = document.getElementById('agregarBtn');
    var formularioABMForm = document.getElementById('formularioABMForm');
    var tipoPersonaSelect = document.getElementById('tipoPersona');
    var campoDNI = document.getElementById('campoDNI');
    var campoPaisOrigen = document.getElementById('campoPaisOrigen');

    if (agregarBtn && formularioABMForm && tipoPersonaSelect) {
        agregarBtn.addEventListener('click', mostrarFormularioABM);
        formularioABMForm.addEventListener('submit', agregarElemento);
        tipoPersonaSelect.addEventListener('change', mostrarCamposSegunTipoPersona);
    } else {
        console.error('No se encontró el botón agregar, el formulario ABM o el selector de tipo de persona.');
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

function mostrarFormularioABM() {
    document.querySelector('.listadoPersonas').style.display = 'none';
    document.getElementById('formularioABM').style.display = 'block';
    document.getElementById('tipoPersona').value = '';
    mostrarCamposSegunTipoPersona();
    limpiarFormularioABM()
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
