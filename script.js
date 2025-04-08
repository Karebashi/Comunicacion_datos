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
    event.dataTransfer.setData("type", event.target.className.includes('atenuacion') ? 'atenuacion' : 'ganancia');
}

function dragOver(event) {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0e0e0';
}

function drop(event) {
    event.preventDefault();
    dropZone.style.backgroundColor = '#f9f9f9'; 

    const inputContainer = document.getElementById('inputContainer');
    inputContainer.style.display = 'block'; 

    const ajusteValor = document.getElementById('ajusteValor');
    ajusteValor.value = '';
    ajusteValor.dataset.tipo = draggedElement.id === 'atenuacionFigura' ? 'atenuacion' : 'ganancia';
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

    ajustes.forEach((ajuste, index) => {
        const ajusteDiv = document.createElement('div');
        ajusteDiv.className = 'ajuste-item';
        ajusteDiv.textContent = `${index + 1}. ${ajuste > 0 ? '+' : ''}${ajuste} dB`; // Add sequential number
        ajusteDiv.dataset.index = index;

        ajusteDiv.style.backgroundColor = ajuste > 0 ? 'green' : 'red';
        ajusteDiv.style.color = 'white';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => eliminarAjuste(index);

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
    const pasoAPaso = document.getElementById('pasoAPasoAtenuacion');
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
    document.getElementById('pasoAPasoAtenuacion').innerHTML = '';
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
let displayValue = "0";
let operacionActual = "";
let valorAnterior = null;
let esperandoSegundoOperando = false;
let currentUnit = ""; // Track the current unit (dB or dBm)

// Funciones para la calculadora
function actualizarDisplay() {
    const displayElement = document.getElementById("display");
    displayElement.value = `${displayValue} ${currentUnit}`;
}

function agregarNumero(numero) {
    if (esperandoSegundoOperando) {
        displayValue = numero;
        esperandoSegundoOperando = false;
    } else {
        displayValue = displayValue === "0" ? numero : displayValue + numero;
    }
    actualizarDisplay();
}

function agregarDecimal() {
    if (!displayValue.includes(".")) {
        displayValue += ".";
        actualizarDisplay();
    }
}

function limpiarDisplay() {
    displayValue = "0";
    currentUnit = "";
    operacionActual = "";
    valorAnterior = null;
    esperandoSegundoOperando = false;
    actualizarDisplay();
}

function borrarUltimo() {
    displayValue = displayValue.toString().slice(0, -1);
    if (displayValue === "") {
        displayValue = "0";
    }
    actualizarDisplay();
}

function agregarOperador(operador) {
    const valorActual = parseFloat(displayValue);
    if (isNaN(valorActual)) return;

    if (valorAnterior === null) {
        valorAnterior = valorActual;
    } else if (operacionActual) {
        const resultado = realizarCalculo(valorAnterior, valorActual, operacionActual);
        displayValue = String(resultado);
        valorAnterior = resultado;
    }

    esperandoSegundoOperando = true;
    operacionActual = operador;
    actualizarDisplay();
}

function calcularResultado() {
    const valorActual = parseFloat(displayValue);
    if (isNaN(valorActual) || !operacionActual || valorAnterior === null) return;

    const resultado = realizarCalculo(valorAnterior, valorActual, operacionActual);
    const unidad = currentUnit || "dB"; // Default to dB if no unit is set

    const explicacion = `Se realizó la operación ${valorAnterior} ${unidad} ${operacionActual} ${valorActual} ${unidad}, obteniendo ${resultado} ${unidad}.`;
    agregarAlHistorial(`${valorAnterior} ${unidad} ${operacionActual} ${valorActual} ${unidad} = ${resultado} ${unidad}`, explicacion);

    displayValue = String(resultado);
    valorAnterior = null;
    operacionActual = "";
    esperandoSegundoOperando = false;
    actualizarDisplay();
}

function realizarCalculo(num1, num2, operador) {
    switch (operador) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        default:
            return num2;
    }
}

function convertirAdBm() {
    const valorActual = parseFloat(displayValue);
    if (!isNaN(valorActual)) {
        // Conversión de mW a dBm
        const resultadoDbm = 10 * Math.log10(valorActual);
        
        // Agregamos al historial
        const explicacion = `Se convirtió ${valorActual} mW a dBm usando la fórmula dBm = 10 * log10(mW), obteniendo ${resultadoDbm.toFixed(2)} dBm.`;
        agregarAlHistorial(`${valorActual} mW = ${resultadoDbm.toFixed(2)} dBm`, explicacion);
        
        displayValue = String(resultadoDbm.toFixed(2));
        currentUnit = "dBm";
        actualizarDisplay();
        
        // Mostrar paso a paso
        mostrarPasoAPasoDbm(valorActual, resultadoDbm);
    }
}

function convertirAdB() {
    const valorActual = parseFloat(displayValue);
    if (isNaN(valorActual)) return;

    const resultadoDb = Math.pow(10, valorActual / 10);
    const explicacion = `Se convirtió ${valorActual} dBm a mW usando la fórmula mW = 10^(dBm / 10), obteniendo ${resultadoDb.toFixed(2)} mW.`;
    agregarAlHistorial(`${valorActual} dBm = ${resultadoDb.toFixed(2)} mW`, explicacion);
    displayValue = String(resultadoDb.toFixed(2));
    currentUnit = "dB";
    actualizarDisplay();
}

function agregarAlHistorial(texto, explicacion) {
    const historial = document.getElementById("historialCalculos");
    const item = document.createElement("div");
    item.className = "historial-item";
    item.innerHTML = `<strong>${texto}</strong><br><small>${explicacion}</small>`;
    historial.prepend(item);

    // Limitamos a 10 elementos en el historial
    if (historial.children.length > 10) {
        historial.removeChild(historial.lastChild);
    }
}

function mostrarPasoAPasoDbm(valorMw, resultadoDbm) {
    const pasoAPaso = document.getElementById('pasoAPasoDbm');
    pasoAPaso.innerHTML = '';

    const explicacionInicial = document.createElement('p');
    explicacionInicial.textContent = `Para convertir ${valorMw} mW a dBm, seguimos estos pasos:`;
    pasoAPaso.appendChild(explicacionInicial);

    const formulaPaso = document.createElement('p');
    formulaPaso.textContent = `1. Usamos la fórmula: dBm = 10 * log10(potencia en mW).`;
    pasoAPaso.appendChild(formulaPaso);

    const calculoPaso = document.createElement('p');
    calculoPaso.textContent = `2. Sustituimos: dBm = 10 * log10(${valorMw}) = ${resultadoDbm.toFixed(2)} dBm.`;
    pasoAPaso.appendChild(calculoPaso);

    const conclusion = document.createElement('p');
    conclusion.textContent = `Resultado final: ${resultadoDbm.toFixed(2)} dBm.`;
    conclusion.style.fontWeight = 'bold';
    pasoAPaso.appendChild(conclusion);
}

function eliminarHistorial() {
    const historial = document.getElementById("historialCalculos");
    historial.innerHTML = ""; // Clear the history content
}

// Inicializar el display cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const displayElement = document.getElementById("display");
    if (displayElement) {
        displayElement.value = displayValue;
    }
});

let queue = [];

function allowDrop(event) {
    event.preventDefault();
}

function dropOnLine(event) {
    event.preventDefault();
    const type = event.dataTransfer.getData("type");
    const value = parseFloat(prompt(`Ingrese el valor de la ${type === 'atenuacion' ? 'atenuación' : 'ganancia'} en dB:`));

    if (!isNaN(value)) {
        const adjustedValue = type === 'atenuacion' ? -Math.abs(value) : Math.abs(value);
        queue.push({ type, value: adjustedValue });
        addToLine(type, adjustedValue);
    } else {
        alert("Por favor, ingrese un valor válido.");
    }
}

function addToLine(type, value) {
    const line = document.getElementById("lineaAjustes");
    const div = document.createElement("div");
    div.className = `ajuste-item ${type}`;
    div.textContent = `${value} dB`;
    div.style.backgroundColor = type === 'atenuacion' ? 'red' : 'green';
    div.style.color = 'white';

    line.appendChild(div);
}

function calcularCola() {
    if (queue.length === 0) {
        alert("No hay elementos en la cola para calcular.");
        return;
    }

    const totalDb = queue.reduce((sum, item) => sum + item.value, 0);
    document.getElementById("resultadoFinal").textContent = `Resultado Total: ${totalDb.toFixed(2)} dB`;

    mostrarPasoAPaso(queue, totalDb);

    // Desplazar la página al procedimiento
    document.getElementById("pasoAPasoAtenuacion").scrollIntoView({ behavior: "smooth" });
}

function mostrarPasoAPaso(queue, totalDb) {
    const pasoAPaso = document.getElementById("pasoAPasoAtenuacion");
    pasoAPaso.innerHTML = ""; // Clear previous steps

    const explicacionInicial = document.createElement("p");
    explicacionInicial.textContent = "Procedimiento detallado para calcular el resultado total:";
    pasoAPaso.appendChild(explicacionInicial);

    queue.forEach((item, index) => {
        const paso = document.createElement("p");
        paso.textContent = `Paso ${index + 1}: Se agregó una ${item.type === 'atenuacion' ? 'atenuación' : 'ganancia'} de ${Math.abs(item.value)} dB.`;
        paso.style.marginLeft = "20px";
        pasoAPaso.appendChild(paso);

        const razonamiento = document.createElement("p");
        razonamiento.textContent = item.type === 'atenuacion'
            ? "La atenuación reduce la potencia de la señal, por lo que se resta este valor al total."
            : "La ganancia aumenta la potencia de la señal, por lo que se suma este valor al total.";
        razonamiento.style.marginLeft = "40px";
        razonamiento.style.fontStyle = "italic";
        pasoAPaso.appendChild(razonamiento);
    });

    const resultadoPaso = document.createElement("p");
    resultadoPaso.textContent = `Resultado final: La suma total de las atenuaciones y ganancias es ${totalDb.toFixed(2)} dB.`;
    resultadoPaso.style.fontWeight = "bold";
    resultadoPaso.style.marginTop = "10px";
    pasoAPaso.appendChild(resultadoPaso);

    const conclusion = document.createElement("p");
    conclusion.textContent = "Este resultado representa el nivel de potencia final después de aplicar todas las atenuaciones y ganancias.";
    conclusion.style.marginTop = "10px";
    conclusion.style.fontStyle = "italic";
    pasoAPaso.appendChild(conclusion);
}

function reiniciarCola() {
    queue = [];
    document.getElementById("lineaAjustes").innerHTML = "";
    document.getElementById("resultadoFinal").textContent = "";
    document.getElementById("pasoAPasoAtenuacion").innerHTML = ""; // Clear step-by-step explanation
}

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById("lineaAjustes");
    dropZone.addEventListener("dragover", allowDrop);
    dropZone.addEventListener("drop", dropOnLine);
});