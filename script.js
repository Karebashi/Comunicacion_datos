// Funciones de navegación e inicialización
function mostrarModulos() {
    document.getElementById('portada').style.display = 'none';
    document.getElementById('modulos').style.display = 'block';
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

// Funciones de conversión general
function mwDbm(mw) {
    return 10 * Math.log10(mw);
}

function dbmMw(dbm) {
    return Math.pow(10, dbm / 10);
}

// ----- MÓDULO DE ATENUACIÓN Y GANANCIA -----
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
    draggedElement = event.target;
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
        ajusteDiv.textContent = `${ajuste > 0 ? '+' : ''}${ajuste} dB`;
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

// ----- MÓDULO DE TIEMPO DE TRANSMISIÓN -----

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
    document.getElementById("tiempoTransmision").value = tiempo.toFixed(4);

    // Mostrar el paso a paso
    mostrarPasoAPasoTransmision(tamanoMensaje, unidadTamano, bitsMensaje, velocidadTransmision, unidadVelocidad, bitsPorSegundo, tiempo);
}

// Función para mostrar el paso a paso del cálculo
function mostrarPasoAPasoTransmision(tamanoMensaje, unidadTamano, bitsMensaje, velocidadTransmision, unidadVelocidad, bitsPorSegundo, tiempo) {
    const pasoAPaso = document.getElementById('pasoAPasoTransmision');
    pasoAPaso.innerHTML = ''; // Limpia los pasos previos

    // Explicación inicial
    const explicacionInicial = document.createElement('p');
    explicacionInicial.textContent = `Para calcular el tiempo de transmisión, seguimos estos pasos:`;
    pasoAPaso.appendChild(explicacionInicial);

    // Paso 1: Conversión del tamaño del mensaje a bits
    const paso1 = document.createElement('p');
    paso1.textContent = `1. Convertimos el tamaño del mensaje a bits:`;
    pasoAPaso.appendChild(paso1);

    const detallePaso1 = document.createElement('p');
    detallePaso1.textContent = `   - Tamaño del mensaje: ${tamanoMensaje} ${unidadTamano} = ${bitsMensaje} bits`;
    detallePaso1.style.marginLeft = '20px';
    pasoAPaso.appendChild(detallePaso1);

    // Paso 2: Conversión de la velocidad de transmisión a bits por segundo
    const paso2 = document.createElement('p');
    paso2.textContent = `2. Convertimos la velocidad de transmisión a bits por segundo:`;
    pasoAPaso.appendChild(paso2);

    const detallePaso2 = document.createElement('p');
    detallePaso2.textContent = `   - Velocidad de transmisión: ${velocidadTransmision} ${unidadVelocidad} = ${bitsPorSegundo} bps`;
    detallePaso2.style.marginLeft = '20px';
    pasoAPaso.appendChild(detallePaso2);

    // Paso 3: Cálculo del tiempo de transmisión
    const paso3 = document.createElement('p');
    paso3.textContent = `3. Calculamos el tiempo de transmisión usando la fórmula:`;
    pasoAPaso.appendChild(paso3);

    const detallePaso3 = document.createElement('p');
    detallePaso3.textContent = `   - Tiempo de transmisión = Tamaño del mensaje (bits) / Velocidad de transmisión (bps)`;
    detallePaso3.style.marginLeft = '20px';
    pasoAPaso.appendChild(detallePaso3);

    const resultadoPaso3 = document.createElement('p');
    resultadoPaso3.textContent = `   - Tiempo de transmisión = ${bitsMensaje} / ${bitsPorSegundo} = ${tiempo.toFixed(4)} segundos`;
    resultadoPaso3.style.marginLeft = '20px';
    pasoAPaso.appendChild(resultadoPaso3);

    // Explicación final
    const explicacionFinal = document.createElement('p');
    explicacionFinal.textContent = `Este es el tiempo necesario para transmitir el mensaje con los valores proporcionados.`;
    explicacionFinal.style.fontWeight = 'bold';
    pasoAPaso.appendChild(explicacionFinal);
}

// ----- MÓDULO DE CALCULADORA dBm/dB -----

// Variables para la calculadora
let displayValue = "0";
let operacionActual = "";
let valorAnterior = null;
let esperandoSegundoOperando = false;

// Funciones para la calculadora
function actualizarDisplay() {
    document.getElementById("display").value = displayValue;
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
    
    if (operacionActual && valorAnterior !== null) {
        let resultado;
        
        // Si estamos trabajando con valores en dB (detectado por presencia de "dB" en el historial reciente)
        const historialElement = document.getElementById("historialCalculos");
        const operacionEnDb = historialElement && historialElement.firstChild && 
                             historialElement.firstChild.textContent.includes("dB");
        
        if (operacionEnDb) {
            // Para operaciones en dB
            switch(operacionActual) {
                case "+":
                    // Suma directa para niveles de referencia (no potencias)
                    resultado = valorAnterior + valorActual;
                    break;
                case "-":
                    // Resta directa para niveles de referencia (no potencias)
                    resultado = valorAnterior - valorActual;
                    break;
                case "*":
                    // Para multiplicar en dB, se usa la suma logarítmica
                    resultado = valorAnterior + (10 * Math.log10(valorActual));
                    break;
                case "/":
                    // Para dividir en dB, se usa la resta logarítmica
                    resultado = valorAnterior - (10 * Math.log10(valorActual));
                    break;
                default:
                    resultado = valorActual;
            }
            
            // Agregamos al historial con indicación de dB
            agregarAlHistorial(`${valorAnterior} ${operacionActual} ${valorActual} = ${resultado.toFixed(2)} dB`);
        } else {
            // Operaciones normales (no dB)
            resultado = realizarCalculo(valorAnterior, valorActual, operacionActual);
            // Agregamos al historial
            agregarAlHistorial(`${valorAnterior} ${operacionActual} ${valorActual} = ${resultado}`);
        }
        
        displayValue = String(Number(resultado).toFixed(2));
        valorAnterior = null;
        operacionActual = "";
        esperandoSegundoOperando = false;
        actualizarDisplay();
    }
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
        agregarAlHistorial(`${valorActual} mW = ${resultadoDbm.toFixed(2)} dBm`);
        
        displayValue = String(resultadoDbm.toFixed(2));
        actualizarDisplay();
        
        // Mostrar paso a paso
        mostrarPasoAPasoDbm(valorActual, resultadoDbm);
    }
}

function operarEnDb() {
    const valorActual = parseFloat(displayValue);
    if (!isNaN(valorActual)) {
        // No se requiere conversión ya que estamos trabajando directamente con dB
        
        // Agregamos al historial
        agregarAlHistorial(`Valor actual: ${valorActual} dB`);
        
        // Mantenemos el valor tal cual, solo aseguramos que tenga 2 decimales para consistencia
        displayValue = valorActual.toFixed(2);
        actualizarDisplay();
        
        // Mostrar información sobre operaciones en dB
        mostrarInformacionDb(valorActual);
    }
}

function agregarAlHistorial(texto) {
    const historial = document.getElementById("historialCalculos");
    if (historial) {
        const item = document.createElement("div");
        item.className = "historial-item";
        item.textContent = texto;
        historial.prepend(item);
        
        // Limitamos a 10 elementos en el historial
        if (historial.children.length > 10) {
            historial.removeChild(historial.lastChild);
        }
    }
}

function mostrarPasoAPasoDbm(valorMw, resultadoDbm) {
    const pasoAPaso = document.getElementById('pasoAPasoDbm');
    if (pasoAPaso) {
        pasoAPaso.innerHTML = '';

        const explicacionInicial = document.createElement('p');
        explicacionInicial.textContent = `Para convertir ${valorMw} mW a dBm, seguimos estos pasos:`;
        pasoAPaso.appendChild(explicacionInicial);

        const formulaPaso = document.createElement('p');
        formulaPaso.textContent = `1. Usamos la fórmula: dBm = 10 * log10(potencia en mW)`;
        pasoAPaso.appendChild(formulaPaso);

        const calculoPaso = document.createElement('p');
        calculoPaso.textContent = `2. dBm = 10 * log10(${valorMw}) = ${resultadoDbm.toFixed(2)} dBm`;
        pasoAPaso.appendChild(calculoPaso);
    }
}

function mostrarInformacionDb(valorDb) {
    const pasoAPaso = document.getElementById('pasoAPasoDbm');
    if (pasoAPaso) {
        pasoAPaso.innerHTML = '';

        const explicacionInicial = document.createElement('p');
        explicacionInicial.textContent = `Operando con valor en dB: ${valorDb} dB`;
        pasoAPaso.appendChild(explicacionInicial);

        const informacion = document.createElement('p');
        informacion.textContent = `Los decibelios (dB) son una unidad logarítmica que expresa la relación entre dos valores.`;
        pasoAPaso.appendChild(informacion);

        const operacionesDbs = document.createElement('p');
        operacionesDbs.textContent = `Recuerda que para sumar potencias en dB correctamente, debes usar suma logarítmica, no suma algebraica directa.`;
        pasoAPaso.appendChild(operacionesDbs);
        
        const ejemploMultiplicacion = document.createElement('p');
        ejemploMultiplicacion.textContent = `Ejemplo: Si añades 3 dB, doblas la potencia. Si añades 10 dB, multiplicas la potencia por 10.`;
        ejemploMultiplicacion.style.marginLeft = '20px';
        pasoAPaso.appendChild(ejemploMultiplicacion);
        
        const ejemploResta = document.createElement('p');
        ejemploResta.textContent = `Ejemplo: Si restas 3 dB, reduces la potencia a la mitad. Si restas 10 dB, divides la potencia por 10.`;
        ejemploResta.style.marginLeft = '20px';
        pasoAPaso.appendChild(ejemploResta);
    }
}

// Inicializar el display cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const displayElement = document.getElementById("display");
    if (displayElement) {
        displayElement.value = displayValue;
    }
});