var personas = [];

function cargarDatosDesdeAPI() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero", false);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var datos = JSON.parse(xhr.responseText);
            generarListaEnMemoria(datos);
        } else {
            alert("Error al cargar los datos. Código de estado: " + xhr.status);
        }
    };

    xhr.onerror = function() {
        alert("Error al realizar la solicitud.");
    };

    xhr.send();
}

function generarListaEnMemoria(datos) {
    datos.forEach(obj => {
        if (obj.dni !== undefined) {
            var ciudadano = new Ciudadano(obj.id, obj.nombre, obj.apellido, obj.fechaNacimiento, obj.dni);
            personas.push(ciudadano);
        } else if (obj.paisOrigen !== undefined) {
            var extranjero = new Extranjero(obj.id, obj.nombre, obj.apellido, obj.fechaNacimiento, obj.paisOrigen);
            personas.push(extranjero);
        }
    });

    mostrarFormularioYLista(personas);
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

document.addEventListener('DOMContentLoaded', function() {
    cargarDatosDesdeAPI();
});
