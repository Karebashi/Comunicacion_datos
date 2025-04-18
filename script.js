function mostrarModulos() {
    document.getElementById('portada').style.display = 'none';
    document.getElementById('modulos').style.display = 'block';
    openTab({ currentTarget: document.querySelector('.tab-button:nth-child(1)') }, 'atenuacion'); // Open Atenuación y Ganancia
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function mwDbm(mw) {
    return 10 * Math.log10(mw);
}

function dbmMw(dbm) {
    return Math.pow(10, dbm / 10);
}

let ajustes = [];

// Funciones de arrastrar y soltar
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.draggable').forEach(item => {
        item.addEventListener('dragstart', dragStart);
    });

    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('drop', drop);
    }
});

let draggedElement = null;

function dragStart(event) {
    event.dataTransfer.setData("tipo", event.target.className.includes('atenuacion') ? 'atenuacion' : 'ganancia');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const tipo = event.dataTransfer.getData("tipo");
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.style.display = 'block';
    const ajusteValor = document.getElementById('ajusteValor');
    ajusteValor.value = '';
    ajusteValor.dataset.tipo = tipo;
}

function agregarAjusteDesdeDrag() {
    const ajusteValor = document.getElementById('ajusteValor');
    const valor = parseFloat(ajusteValor.value);
    const tipo = ajusteValor.dataset.tipo;

    if (isNaN(valor)) {
        alert('Ingrese un valor válido.');
        return;
    }

    const ajuste = tipo === 'atenuacion' ? -Math.abs(valor) : Math.abs(valor);
    ajustes.push(ajuste);
    mostrarAjustes();

    document.getElementById('inputContainer').style.display = 'none';
}

function mostrarAjustes() {
    const lineaAjustes = document.getElementById('lineaAjustes');
    lineaAjustes.innerHTML = '';

    ajustes.forEach((ajuste) => {
        const ajusteDiv = document.createElement('div');
        ajusteDiv.className = 'ajuste-item';
        ajusteDiv.textContent = `${ajuste > 0 ? '+' : ''}${ajuste} dB`;
        ajusteDiv.style.backgroundColor = ajuste > 0 ? 'green' : 'red';
        ajusteDiv.style.color = 'white';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => eliminarAjuste(ajustes.indexOf(ajuste));

        ajusteDiv.appendChild(deleteButton);
        lineaAjustes.appendChild(ajusteDiv);
    });
}

function eliminarAjuste(index) {
    ajustes.splice(index, 1);
    mostrarAjustes();
}

function calcularSumaLogaritmica() {
    if (ajustes.length === 0) {
        alert('No hay ajustes para calcular.');
        return;
    }

    const potenciasLineales = ajustes.map(ajuste => Math.pow(10, ajuste / 10));
    const sumaPotenciasLineales = potenciasLineales.reduce((total, potencia) => total + potencia, 0);
    const resultadoEnDb = 10 * Math.log10(sumaPotenciasLineales);

    const resultadoFinal = document.getElementById('resultadoFinal');
    resultadoFinal.textContent = `Potencia Final: ${resultadoEnDb.toFixed(2)} dB`;

    mostrarPasoAPasoLogaritmico(potenciasLineales, sumaPotenciasLineales, resultadoEnDb);
}

function mostrarPasoAPasoLogaritmico(potenciasLineales, sumaPotenciasLineales, resultadoEnDb) {
    const pasoAPaso = document.getElementById('pasoAPasoAtenuacionGanancia');
    pasoAPaso.innerHTML = '';

    const explicacionInicial = document.createElement('p');
    explicacionInicial.textContent = `Para calcular la suma logarítmica de niveles de potencia en decibeles (dB), seguimos estos pasos:`;
    pasoAPaso.appendChild(explicacionInicial);

    const paso1 = document.createElement('p');
    paso1.textContent = `1. Convertimos cada valor en dB a su potencia lineal usando la fórmula: Potencia Lineal = 10^(dB / 10).`;
    pasoAPaso.appendChild(paso1);

    potenciasLineales.forEach((potencia, index) => {
        const detallePaso1 = document.createElement('p');
        detallePaso1.textContent = `   - Para el valor ${ajustes[index]} dB: Potencia Lineal = ${potencia.toFixed(4)}`;
        detallePaso1.style.marginLeft = '20px';
        pasoAPaso.appendChild(detallePaso1);
    });

    const paso2 = document.createElement('p');
    paso2.textContent = `2. Sumamos todas las potencias lineales obtenidas:`;
    pasoAPaso.appendChild(paso2);

    const detallePaso2 = document.createElement('p');
    detallePaso2.textContent = `   - Suma de Potencias Lineales = ${sumaPotenciasLineales.toFixed(4)}`;
    detallePaso2.style.marginLeft = '20px';
    pasoAPaso.appendChild(detallePaso2);

    const paso3 = document.createElement('p');
    paso3.textContent = `3. Convertimos la suma de potencias lineales de nuevo a dB usando la fórmula: dB = 10 * log10(Suma de Potencias Lineales).`;
    pasoAPaso.appendChild(paso3);

    const detallePaso3 = document.createElement('p');
    detallePaso3.textContent = `   - Resultado en dB = ${resultadoEnDb.toFixed(2)} dB`;
    detallePaso3.style.marginLeft = '20px';
    pasoAPaso.appendChild(detallePaso3);

    const explicacionFinal = document.createElement('p');
    explicacionFinal.textContent = `Este es el resultado final de la suma logarítmica de los niveles de potencia en dB.`;
    explicacionFinal.style.fontWeight = 'bold';
    pasoAPaso.appendChild(explicacionFinal);
}

function reiniciarAjustes() {
    ajustes = [];
    mostrarAjustes();
    document.getElementById('resultadoFinal').textContent = '';
    document.getElementById('pasoAPasoAtenuacionGanancia').innerHTML = '';
}

// Función para calcular el tiempo de transmisión
function calcularTiempoTransmision() {
    const tamanoMensaje = parseFloat(document.getElementById("tamanoMensaje").value);
    const velocidadTransmision = parseFloat(document.getElementById("velocidadTransmision").value);
    const unidadTamano = document.getElementById("unidadTamano").value;
    const unidadVelocidad = document.getElementById("unidadVelocidad").value;

    // Validaciones de entrada
    if (isNaN(tamanoMensaje) || isNaN(velocidadTransmision) || tamanoMensaje <= 0 || velocidadTransmision <= 0) {
        alert("Por favor, ingrese valores válidos para el tamaño del mensaje y la velocidad de transmisión.");
        return;
    }

    if (!unidadTamano || !unidadVelocidad) {
        alert("Por favor, seleccione las unidades para el tamaño del mensaje y la velocidad de transmisión.");
        return;
    }

    // Conversión de unidades (definiciones decimales)
    const conversion = {
        bits: 1, bytes: 8,
        kb: 1000, kB: 1000 * 8,
        mb: 1000 * 1000, MB: 1000 * 1000 * 8,
        gb: 1000 * 1000 * 1000, GB: 1000 * 1000 * 1000 * 8,
        bps: 1, kbps: 1000, mbps: 1000 * 1000, gbps: 1000 * 1000 * 1000
    };

    const bitsMensaje = tamanoMensaje * conversion[unidadTamano];
    const bitsPorSegundo = velocidadTransmision * conversion[unidadVelocidad];

    // Cálculo del tiempo de transmisión
    const tiempo = bitsMensaje / bitsPorSegundo;

    // Mostrar el resultado
    document.getElementById("tiempoTransmision").textContent = `${tiempo.toFixed(4)} segundos`; // Update styled div

    // Mostrar el paso a paso
    mostrarPasoAPasoTransmision(tamanoMensaje, unidadTamano, bitsMensaje, velocidadTransmision, unidadVelocidad, bitsPorSegundo, tiempo);

    // Desplazar la página al procedimiento
    document.getElementById("pasoAPasoTransmision").scrollIntoView({ behavior: "smooth" });
}

// Función para mostrar las unidades según la selección (bits o bytes)
function mostrarUnidades(tipo) {
    const unidadTamano = document.getElementById('unidadTamano');
    unidadTamano.style.display = 'block'; // Muestra el selector de unidades
    unidadTamano.innerHTML = ''; // Limpia las opciones previas

    if (tipo === 'bits') {
        unidadTamano.innerHTML = `
            <option value="bits">bits</option>
            <option value="kb">kilobits (kb)</option>
            <option value="mb">megabits (mb)</option>
            <option value="gb">gigabits (gb)</option>
        `;
    } else if (tipo === 'bytes') {
        unidadTamano.innerHTML = `
            <option value="bytes">bytes</option>
            <option value="kB">kilobytes (kB)</option>
            <option value="MB">megabytes (MB)</option>
            <option value="GB">gigabytes (GB)</option>
        `;
    }
}

// Función para mostrar el paso a paso del cálculo
function mostrarPasoAPasoTransmision(tamanoMensaje, unidadTamano, bitsMensaje, velocidadTransmision, unidadVelocidad, bitsPorSegundo, tiempo) {
    const pasoAPaso = document.getElementById('pasoAPasoTransmision');
    pasoAPaso.innerHTML = ''; // Clear previous steps

    // Explicación inicial
    const explicacionInicial = document.createElement('p');
    explicacionInicial.textContent = `Para calcular el tiempo de transmisión, seguimos un enfoque paso a paso para entender cómo se relacionan el tamaño del mensaje y la velocidad de transmisión.`;
    explicacionInicial.style.marginBottom = '15px';
    pasoAPaso.appendChild(explicacionInicial);

    // Paso 1: Conversión del tamaño del mensaje a bits
    const paso1 = document.createElement('p');
    paso1.textContent = `1. Convertimos el tamaño del mensaje a bits. Esto es importante porque la velocidad de transmisión generalmente se mide en bits por segundo (bps).`;
    paso1.style.marginBottom = '10px';
    pasoAPaso.appendChild(paso1);

    const detallePaso1 = document.createElement('p');
    detallePaso1.textContent = `   - Tamaño del mensaje: ${tamanoMensaje} ${unidadTamano} = ${bitsMensaje} bits.`;
    detallePaso1.style.marginLeft = '20px';
    detallePaso1.style.marginBottom = '15px';
    pasoAPaso.appendChild(detallePaso1);

    // Paso 2: Conversión de la velocidad de transmisión a bits por segundo
    const paso2 = document.createElement('p');
    paso2.textContent = `2. Convertimos la velocidad de transmisión a bits por segundo (bps). Esto asegura que ambas magnitudes estén en las mismas unidades.`;
    paso2.style.marginBottom = '10px';
    pasoAPaso.appendChild(paso2);

    const detallePaso2 = document.createElement('p');
    detallePaso2.textContent = `   - Velocidad de transmisión: ${velocidadTransmision} ${unidadVelocidad} = ${bitsPorSegundo} bps.`;
    detallePaso2.style.marginLeft = '20px';
    detallePaso2.style.marginBottom = '15px';
    pasoAPaso.appendChild(detallePaso2);

    // Paso 3: Cálculo del tiempo de transmisión
    const paso3 = document.createElement('p');
    paso3.textContent = `3. Calculamos el tiempo de transmisión dividiendo el tamaño del mensaje en bits entre la velocidad de transmisión en bps.`;
    paso3.style.marginBottom = '10px';
    pasoAPaso.appendChild(paso3);

    const detallePaso3 = document.createElement('p');
    detallePaso3.textContent = `   - Tiempo de transmisión = Tamaño del mensaje (bits) / Velocidad de transmisión (bps).`;
    detallePaso3.style.marginLeft = '20px';
    detallePaso3.style.marginBottom = '10px';
    pasoAPaso.appendChild(detallePaso3);

    const resultadoPaso3 = document.createElement('p');
    resultadoPaso3.textContent = `   - Tiempo de transmisión = ${bitsMensaje} / ${bitsPorSegundo} = ${tiempo.toFixed(4)} segundos.`;
    resultadoPaso3.style.marginLeft = '20px';
    resultadoPaso3.style.marginBottom = '15px';
    pasoAPaso.appendChild(resultadoPaso3);

    // Explicación final
    const explicacionFinal = document.createElement('p');
    explicacionFinal.textContent = `Este resultado nos indica cuánto tiempo tardará en transmitirse el mensaje completo a la velocidad especificada.`;
    explicacionFinal.style.fontWeight = 'bold';
    explicacionFinal.style.marginTop = '15px';
    pasoAPaso.appendChild(explicacionFinal);
}

// Variables para la calculadora
let display = document.getElementById("display");
let pasoAPaso = document.getElementById("pasoAPasoDbm");
let historial = document.getElementById("historialCalculos");
let expresion = "";


function agregarUnidad(unidad) {
    display.value += " " + unidad;
    expresion += " " + unidad;
}

function agregarNumero(num) {
    if (display.value === "0") display.value = num;
    else display.value += num;
    expresion += num;
}

function agregarOperador(op) {
    display.value += " " + op + " ";
    expresion += " " + op + " ";
}

function agregarDecimal() {
    display.value += ".";
    expresion += ".";
}

function borrarUltimo() {
    display.value = display.value.slice(0, -1);
    expresion = expresion.slice(0, -1);
}

function limpiarDisplay() {
    display.value = "0";
    expresion = "";
    pasoAPaso.innerHTML = "";
}

function convertirAdBm() {
    display.value += " dBm";
    expresion += " dBm";
}

function convertirAdB() {
    display.value += " dB";
    expresion += " dB";
}

function operarEnDb() {
    display.value += " dB";
    expresion += " dB";
}
function calcularResultado() {
    try {
        let partes = expresion.trim().split(" ");
        if (partes.length < 3) return;

        let [valor1, unidad1, operador, valor2, unidad2] = partes;

        valor1 = parseFloat(valor1);
        valor2 = parseFloat(valor2);

        if (isNaN(valor1) || isNaN(valor2)) {
            display.value = "Error";
            return;
        }

        // Conversiones
        const convertirAdBmW = (valor, unidad) => {
            if (unidad === "dBm") return Math.pow(10, valor / 10); // mW
            if (unidad === "dBW") return Math.pow(10, valor / 10) * 1000; // W → mW
            if (unidad === "dB") return valor; // dB es relativo
            return valor;
        };

        const convertirDesdemW = (valorEnmW, unidadDestino) => {
            if (unidadDestino === "dBm") return 10 * Math.log10(valorEnmW);
            if (unidadDestino === "dBW") return 10 * Math.log10(valorEnmW / 1000);
            return valorEnmW;
        };

        // Variables para el paso a paso
        let baseUnit = unidad1;
        let resultado = 0;
        let pasos = [];

        if (unidad1 === "dBm" && unidad2 === "dB" && (operador === "+" || operador === "-")) {
            resultado = operador === "+" ? valor1 + valor2 : valor1 - valor2;
            pasos.push(`Operación directa: ${valor1} dBm ${operador} ${valor2} dB = ${resultado.toFixed(2)} dBm`);
        } else if (unidad1 === "dBW" && unidad2 === "dB" && (operador === "+" || operador === "-")) {
            resultado = operador === "+" ? valor1 + valor2 : valor1 - valor2;
            pasos.push(`Operación directa: ${valor1} dBW ${operador} ${valor2} dB = ${resultado.toFixed(2)} dBW`);
        } else if ((unidad1 === "dBm" || unidad1 === "dBW") && (unidad2 === "dBm" || unidad2 === "dBW")) {
            // Ambos son absolutos → convertir a mW, operar, y volver
            let mW1 = convertirAdBmW(valor1, unidad1);
            let mW2 = convertirAdBmW(valor2, unidad2);
            let operacionLineal;

            if (operador === "+") operacionLineal = mW1 + mW2;
            else if (operador === "-") operacionLineal = mW1 - mW2;
            else if (operador === "*") operacionLineal = mW1 * mW2;
            else if (operador === "/") operacionLineal = mW1 / mW2;

            resultado = convertirDesdemW(operacionLineal, unidad1);
            pasos.push(`Convertimos a mW: ${valor1} ${unidad1} → ${mW1.toFixed(4)} mW`);
            pasos.push(`Convertimos a mW: ${valor2} ${unidad2} → ${mW2.toFixed(4)} mW`);
            pasos.push(`Realizamos la operación en mW: ${mW1.toFixed(4)} ${operador} ${mW2.toFixed(4)} = ${operacionLineal.toFixed(4)} mW`);
            pasos.push(`Convertimos el resultado de mW a ${unidad1}: ${operacionLineal.toFixed(4)} mW → ${resultado.toFixed(2)} ${unidad1}`);
        } else if (unidad1 === "dB" || unidad2 === "dB") {
            display.value = "Operación inválida";
            pasos.push("No se puede operar dos valores relativos (dB) ni hacer operaciones absolutas con dB sin base.");
            mostrarPasoAPaso(pasos);
            return;
        } else {
            display.value = "Unidades no compatibles";
            return;
        }

        display.value = resultado.toFixed(2) + " " + baseUnit;
        historial.innerHTML += `<div>${expresion} = ${resultado.toFixed(2)} ${baseUnit}</div>`;
        expresion = "";

        function eliminarHistorial() {
            historial.innerHTML = "";
        }

        // Mostrar el paso a paso
        mostrarPasoAPaso(pasos);
    } catch (error) {
        display.value = "Error";
        console.error(error);
    }
}
function mostrarPasoAPaso(pasos) {
    const pasoAPaso = document.getElementById('pasoAPasoDbm');
    pasoAPaso.innerHTML = ''; // Limpiar contenido previo

    const titulo = document.createElement('h3');
    titulo.textContent = "Paso a paso del cálculo:";
    titulo.style.color = "#333";
    titulo.style.marginBottom = "10px";
    pasoAPaso.appendChild(titulo);

    pasos.forEach((paso, index) => {
        const pasoDiv = document.createElement('div');
        pasoDiv.textContent = `${index + 1}. ${paso}`;
        pasoDiv.style.marginBottom = "8px";
        pasoDiv.style.padding = "10px";
        pasoDiv.style.border = "1px solid #ddd";
        pasoDiv.style.borderRadius = "5px";
        pasoDiv.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#e9e9e9";
        pasoAPaso.appendChild(pasoDiv);
    });

    // Explicación adicional del porqué funciona así
    const explicacion = document.createElement('div');
    explicacion.innerHTML = `
        <h4>¿Por qué funciona así?</h4>
        <p>Los cálculos con decibelios (dB) se basan en una escala logarítmica, lo que permite expresar relaciones de potencia de forma compacta.</p>
        <p>Cuando trabajamos con valores absolutos como dBm o dBW, estamos midiendo la potencia en relación a una referencia fija (1 mW o 1 W, respectivamente).</p>
        <p>Por otro lado, los valores relativos en dB representan una relación entre dos potencias o amplitudes.</p>
        <p>Para realizar operaciones con dBm o dBW, es necesario convertir los valores a potencias lineales (mW o W), realizar las operaciones, y luego convertir el resultado de vuelta a dBm o dBW.</p>
        <p>Esto se debe a que los logaritmos convierten multiplicaciones en sumas, lo que simplifica los cálculos en sistemas de comunicación.</p>
    `;
    explicacion.style.marginTop = "20px";
    explicacion.style.padding = "15px";
    explicacion.style.border = "1px solid #ccc";
    explicacion.style.borderRadius = "5px";
    explicacion.style.backgroundColor = "#f9f9f9";
    pasoAPaso.appendChild(explicacion);
}
// Función para calcular el enlace de radio
let datosEnlaceRadio = [];

// Función para iniciar el arrastre
function dragStartRadio(event) {
    event.dataTransfer.setData("tipo", event.target.dataset.tipo); // Guarda el tipo del elemento arrastrado
}

// Función para permitir el evento de soltar
function dragOverRadio(event) {
    event.preventDefault(); // Permite el evento de soltar
}

let tipoDatoActual = null; // Variable para almacenar el tipo de dato actual

function dropRadio(event) {
    event.preventDefault();
    tipoDatoActual = event.dataTransfer.getData("tipo"); // Recupera el tipo del elemento arrastrado
    mostrarFormulario(); // Muestra el formulario emergente
}

function mostrarFormulario() {
    const formulario = document.getElementById('formularioEmergente');
    formulario.style.display = 'block';

    const valorInput = document.getElementById('valorDato');
    valorInput.value = ''; // Limpia el valor previo
}

function cerrarFormulario() {
    const formulario = document.getElementById('formularioEmergente');
    formulario.style.display = 'none';
    tipoDatoActual = null; // Resetea el tipo de dato actual
}

function agregarDatoDesdeFormulario() {
    const valorInput = document.getElementById('valorDato');
    const valor = parseFloat(valorInput.value);

    if (isNaN(valor)) {
        alert("Por favor, ingrese un valor numérico válido.");
        return;
    }

    datosEnlaceRadio.push({ tipo: tipoDatoActual, valor }); // Agrega el dato al arreglo
    mostrarDatosEnlaceRadio(); // Actualiza la visualización
    cerrarFormulario(); // Cierra el formulario
}

function mostrarDatosEnlaceRadio() {
    const dropZone = document.getElementById('dropZoneRadio');
    dropZone.innerHTML = ''; // Limpia los rectángulos previos

    datosEnlaceRadio.forEach((dato, index) => {
        // Crear rectángulo para representar el dato
        const rect = document.createElement('div');
        rect.className = 'ajuste-item';
        rect.textContent = `${dato.valor}`; // Muestra solo el valor numérico
        rect.style.backgroundColor = obtenerColorPorTipo(dato.tipo);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => eliminarDatoRadio(index);

        rect.appendChild(deleteButton);
        dropZone.appendChild(rect);
    });

    // Si no hay datos, muestra el texto "Arrastra aquí"
    if (datosEnlaceRadio.length === 0) {
        dropZone.innerHTML = '<p>Arrastra aquí</p>';
    }
}

// Función para obtener el color según el tipo
function obtenerColorPorTipo(tipo) {
    switch (tipo) {
        case 'potenciaTransmitida': return 'red';
        case 'gananciaTransmisora': return 'green';
        case 'gananciaReceptora': return 'blue';
        case 'distancia': return 'orange';
        case 'frecuencia': return 'purple';
        default: return 'gray';
    }
}

// Función para eliminar un dato
function eliminarDatoRadio(index) {
    datosEnlaceRadio.splice(index, 1); // Elimina el dato del arreglo
    mostrarDatosEnlaceRadio(); // Actualiza la visualización
}

// Configuración de eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.draggable-radio').forEach(item => {
        item.addEventListener('dragstart', dragStartRadio);
    });

    const dropZone = document.getElementById('dropZoneRadio');
    if (dropZone) {
        dropZone.addEventListener('dragover', dragOverRadio);
        dropZone.addEventListener('drop', dropRadio);
    }
});

function calcularFSPL() {
    const distancia = obtenerValorPorTipo('distancia');
    const frecuencia = obtenerValorPorTipo('frecuencia');
    const c = 3e8;

    if (distancia === null || frecuencia === null) {
        alert("Faltan datos: asegúrate de ingresar distancia y frecuencia.");
        return;
    }

    const fspl = 20 * Math.log10(distancia) + 20 * Math.log10(frecuencia) - 20 * Math.log10(c);

    document.getElementById("resultadoEnlaceRadio").innerHTML = `
        <p><strong>Pérdida en el Espacio Libre (FSPL):</strong> ${fspl.toFixed(2)} dB</p>
    `;
    document.getElementById("pasoAPasoEnlaceRadio").innerHTML = `
        <h4>Paso a paso FSPL:</h4>
        <p>FSPL = 20 * log10(${distancia}) + 20 * log10(${frecuencia}) - 20 * log10(3x10⁸)</p>
        <p>FSPL = ${fspl.toFixed(2)} dB</p>
    `;
}

function calcularPotenciaRecibida() {
    const pt = obtenerValorPorTipo('potenciaTransmitida');
    const gt = obtenerValorPorTipo('gananciaTransmisora');
    const gr = obtenerValorPorTipo('gananciaReceptora');
    const d = obtenerValorPorTipo('distancia');
    const f = obtenerValorPorTipo('frecuencia');
    const c = 3e8;

    if (pt === null || gt === null || gr === null || d === null || f === null) {
        alert("Faltan datos: asegúrate de ingresar todos los parámetros necesarios.");
        return;
    }

    const fspl = 20 * Math.log10(d) + 20 * Math.log10(f) - 20 * Math.log10(c);
    const pr = pt + gt + gr - fspl;

    document.getElementById("resultadoEnlaceRadio").innerHTML = `
        <p><strong>Potencia Recibida:</strong> ${pr.toFixed(2)} dBm</p>
    `;
    document.getElementById("pasoAPasoEnlaceRadio").innerHTML = `
        <h4>Paso a paso Potencia Recibida:</h4>
        <p>FSPL = 20 * log10(${d}) + 20 * log10(${f}) - 20 * log10(3x10⁸)</p>
        <p>FSPL = ${fspl.toFixed(2)} dB</p>
        <p>P<sub>r</sub> = ${pt} + ${gt} + ${gr} - ${fspl.toFixed(2)}</p>
        <p><strong>Resultado:</strong> ${pr.toFixed(2)} dBm</p>
    `;
}

function obtenerValorPorTipo(tipo) {
    const dato = datosEnlaceRadio.find(d => d.tipo === tipo);
    return dato ? parseFloat(dato.valor) : null;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.draggable-radio').forEach(item => {
        item.addEventListener('dragstart', dragStartRadio);
    });

    const dropZone = document.getElementById('dropZoneRadio');
    if (dropZone) {
        dropZone.addEventListener('dragover', dragOverRadio);
        dropZone.addEventListener('drop', dropRadio);
    }
});
// Función para mostrar el gráfico de AM
function generarGraficoAM() {
    const fc = parseFloat(document.getElementById('frecuenciaPortadora').value); // Frecuencia portadora
    const fm = parseFloat(document.getElementById('frecuenciaModuladora').value); // Frecuencia moduladora
    const m = parseFloat(document.getElementById('indiceModulacion').value); // Índice de modulación

    if (isNaN(fc) || isNaN(fm) || isNaN(m) || fc <= 0 || fm <= 0 || m < 0 || m > 1) {
        alert('Por favor, ingrese valores válidos para las frecuencias y el índice de modulación.');
        return;
    }

    const canvas = document.getElementById('graficoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const samples = 1000; // Número de muestras
    const dt = 1 / (fc * 10); // Intervalo de tiempo entre muestras
    const tMax = samples * dt; // Tiempo total
    const scaleX = width / tMax; // Escala en X
    const scaleY = centerY * 0.8; // Escala en Y

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    for (let i = 0; i < samples; i++) {
        const t = i * dt;
        const moduladora = 1 + m * Math.cos(2 * Math.PI * fm * t); // Señal moduladora
        const portadora = Math.cos(2 * Math.PI * fc * t); // Señal portadora
        const señalModulada = moduladora * portadora; // Señal modulada

        const x = t * scaleX;
        const y = centerY - señalModulada * scaleY;

        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#1E90FF';
    ctx.lineWidth = 2;
    ctx.stroke();
}

