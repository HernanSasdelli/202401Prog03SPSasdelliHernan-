function validarNombre(nombre) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        throw new Error("Nombre debe ser un string no nulo y no vacío.");
    }
    return true;
}

function validarApellido(apellido) {
    if (typeof apellido !== 'string' || apellido.trim() === '') {
        throw new Error("Apellido debe ser un string no nulo y no vacío.");
    }
    return true;
}

function validarFechaNacimiento(fechaNacimiento) {
    if (!/^\d{8}$/.test(fechaNacimiento)) {
        throw new Error("Fecha de nacimiento debe ser un número en formato AAAAMMDD.");
    }
    return true;
}

function validarDNI(dni) {
    const dniNumero = parseInt(dni, 10);
    if (isNaN(dniNumero) || dniNumero <= 0) {
        throw new Error("DNI debe ser un número entero positivo mayor a 0.");
    }
    return true;
}


function validarPaisOrigen(paisOrigen) {
    if (typeof paisOrigen !== 'string' || paisOrigen.trim() === '') {
        throw new Error("País de origen debe ser un string no nulo y no vacío.");
    }
    return true;
}

/*limpia el form*/
function limpiarFormularioABM() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('fechaNacimiento').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('paisOrigen').value = '';
    document.getElementById('tipoPersona').value = '';
    mostrarCamposSegunTipoPersona(); 
}