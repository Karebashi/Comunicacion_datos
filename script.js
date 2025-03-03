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

function mwDbm(mw) {
    return 10 * Math.log10(mw);
}

function dbmMw(dbm) {
    return Math.pow(10, dbm / 10);
}

let ajustes = [];

function agregarAjuste() {
    let potenciaEntrada = parseFloat(document.getElementById("potenciaEntrada").value);
    let ajusteDb = parseFloat(document.getElementById("ajusteDb").value);

    if (isNaN(potenciaEntrada) || potenciaEntrada <= 0) {
        alert("Ingrese una potencia de entrada válida.");
        return;
    }

    if (isNaN(ajusteDb)) {
        alert("Ingrese un ajuste válido.");
        return;
    }

    ajustes.push(ajusteDb);
    mostrarAjustes();
}

function mostrarAjustes() {
    let linea = document.getElementById('lineaAjustes');
    linea.innerHTML = '';
    ajustes.forEach((ajuste, index) => {
        let item = document.createElement('div');
        item.className = 'bloque-ajuste';
        item.style.backgroundColor = ajuste < 0 ? 'red' : 'green';
        item.innerHTML = `${ajuste} dB`;
        linea.appendChild(item);
    });
}

function calcularPotenciaFinal() {
    let potenciaEntrada = parseFloat(document.getElementById("potenciaEntrada").value);
    let potenciaDbm = mwDbm(potenciaEntrada);

    let pasoAPaso = `Potencia de entrada: ${potenciaEntrada} mW (${potenciaDbm.toFixed(2)} dBm)<br>`;

    ajustes.forEach(ajuste => {
        potenciaDbm += ajuste;
        pasoAPaso += `Ajuste: ${ajuste} dB -> Potencia acumulada: ${potenciaDbm.toFixed(2)} dBm<br>`;
    });

    let potenciaFinalMw = dbmMw(potenciaDbm);

    let resultadoFinal = document.getElementById('resultadoFinal');
    resultadoFinal.innerHTML = `Potencia final en mW: ${potenciaFinalMw.toFixed(2)} mW<br>Potencia final en dBm: ${potenciaDbm.toFixed(2)} dBm`;

    let pasoAPasoAtenuacion = document.getElementById('pasoAPasoAtenuacion');
    pasoAPasoAtenuacion.innerHTML = pasoAPaso;
}

function reiniciarAjustes() {
    ajustes = [];
    document.getElementById('potenciaEntrada').value = '';
    document.getElementById('ajusteDb').value = '';
    document.getElementById('lineaAjustes').innerHTML = '';
    document.getElementById('resultadoFinal').innerHTML = '';
    document.getElementById('pasoAPasoAtenuacion').innerHTML = '';
}

function mostrarUnidades(tipo) {
    const unidadTamano = document.getElementById('unidadTamano');
    unidadTamano.style.display = 'block';
    unidadTamano.innerHTML = '';

    if (tipo === 'bits') {
        unidadTamano.innerHTML = `
            <option value="bits">bits</option>
            <option value="kb">Kb</option>
            <option value="mb">Mb</option>
            <option value="gb">Gb</option>
        `;
    } else if (tipo === 'bytes') {
        unidadTamano.innerHTML = `
            <option value="bytes">bytes</option>
            <option value="kB">KB</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
        `;
    }
}

function calcularTiempoTransmision() {
    let tamanoMensaje = parseFloat(document.getElementById("tamanoMensaje").value);
    let velocidadTransmision = parseFloat(document.getElementById("velocidadTransmision").value);
    let unidadTamano = document.getElementById("unidadTamano").value;
    let unidadVelocidad = document.getElementById("unidadVelocidad").value;

    if (isNaN(tamanoMensaje) || isNaN(velocidadTransmision) || tamanoMensaje <= 0 || velocidadTransmision <= 0) {
        alert("Ingrese valores válidos.");
        return;
    }

    if (!unidadTamano) {
        alert("Seleccione una unidad para el tamaño del mensaje.");
        return;
    }

    let conversion = {
        bits: 1, bytes: 8,
        kb: 1024, kB: 1024 * 8,
        mb: 1024 * 1024, MB: 1024 * 1024 * 8,
        gb: 1024 * 1024 * 1024, GB: 1024 * 1024 * 1024 * 8,
        bps: 1, kbps: 1024, mbps: 1024 * 1024, gbps: 1024 * 1024 * 1024
    };

    if (!(unidadTamano in conversion) || !(unidadVelocidad in conversion)) {
        alert("Unidad de medida no válida.");
        return;
    }

    let bitsMensaje = tamanoMensaje * conversion[unidadTamano];
    let bitsPorSegundo = velocidadTransmision * conversion[unidadVelocidad];

    let tiempo = bitsMensaje / bitsPorSegundo;

    document.getElementById("tiempoTransmision").value = tiempo.toFixed(4);

    let pasoAPasoTransmision = `
        Tamaño del mensaje: ${tamanoMensaje} ${unidadTamano} (${bitsMensaje} bits)<br>
        Velocidad de transmisión: ${velocidadTransmision} ${unidadVelocidad} (${bitsPorSegundo} bps)<br>
        Tiempo de transmisión: ${tiempo.toFixed(4)} segundos
    `;

    document.getElementById('pasoAPasoTransmision').innerHTML = pasoAPasoTransmision;
}

function calcularFrecuenciaModulada() {
    let amplitudPortadora = parseFloat(document.getElementById("amplitudPortadora").value);
    let frecuenciaPortadora = parseFloat(document.getElementById("frecuenciaPortadora").value);
    let amplitudModuladora = parseFloat(document.getElementById("amplitudModuladora").value);
    let frecuenciaModuladora = parseFloat(document.getElementById("frecuenciaModuladora").value);

    if (isNaN(amplitudPortadora) || isNaN(frecuenciaPortadora) || isNaN(amplitudModuladora) || isNaN(frecuenciaModuladora) || amplitudPortadora <= 0 || frecuenciaPortadora <= 0 || amplitudModuladora <= 0 || frecuenciaModuladora <= 0) {
        alert("Ingrese valores válidos.");
        return;
    }

    let ctxPortadora = document.getElementById('graficaPortadora').getContext('2d');
    let ctxModuladora = document.getElementById('graficaModuladora').getContext('2d');
    let ctxModulada = document.getElementById('graficaModulada').getContext('2d');
    let dataPortadora = [];
    let dataModuladora = [];
    let dataModulada = [];
    let labels = [];
    let t = 0;
    let dt = 0.001;

    for (let i = 0; i < 1000; i++) {
        let portadora = amplitudPortadora * Math.sin(2 * Math.PI * frecuenciaPortadora * t);
        let moduladora = amplitudModuladora * Math.sin(2 * Math.PI * frecuenciaModuladora * t);
        let modulada = (amplitudPortadora + moduladora) * Math.sin(2 * Math.PI * frecuenciaPortadora * t);

        dataPortadora.push(portadora);
        dataModuladora.push(moduladora);
        dataModulada.push(modulada);
        labels.push(t.toFixed(2));
        t += dt;
    }

    new Chart(ctxPortadora, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Señal Portadora',
                data: dataPortadora,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitud'
                    }
                }
            }
        }
    });

    new Chart(ctxModuladora, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Señal Moduladora',
                data: dataModuladora,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitud'
                    }
                }
            }
        }
    });

    new Chart(ctxModulada, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Señal Modulada (AM)',
                data: dataModulada,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitud'
                    }
                }
            }
        }
    });
}