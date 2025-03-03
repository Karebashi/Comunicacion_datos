function calcularPotenciaSalida() {
    let potenciaEntrada = parseFloat(document.getElementById("potenciaEntrada").value);
    
    if (isNaN(potenciaEntrada) || potenciaEntrada <= 0) {
        alert("Ingrese una potencia de entrada válida.");
        return;
    }

    // Simulación de pérdida o ganancia (puedes modificar esta lógica)
    let factor = Math.random() * 10 - 5; // entre -5 y +5 dB
    let potenciaSalidaDbm = 10 * Math.log10(potenciaEntrada) + factor;
    let potenciaSalida = Math.pow(10, potenciaSalidaDbm / 10);

    document.getElementById("potenciaSalida").value = potenciaSalida.toFixed(2);
    document.getElementById("potenciaSalidaDbm").value = potenciaSalidaDbm.toFixed(2);
}

function calcularTiempoTransmision() {
    let tamanoMensaje = parseFloat(document.getElementById("tamanoMensaje").value);
    let velocidadTransmision = parseFloat(document.getElementById("velocidadTransmision").value);
    
    if (isNaN(tamanoMensaje) || isNaN(velocidadTransmision) || tamanoMensaje <= 0 || velocidadTransmision <= 0) {
        alert("Ingrese valores válidos.");
        return;
    }

    let unidadTamano = document.getElementById("unidadTamano").value;
    let unidadVelocidad = document.getElementById("unidadVelocidad").value;

    let conversion = {
        bits: 1, bytes: 8, kb: 1000, kB: 8000, mb: 1e6, MB: 8e6, gb: 1e9, GB: 8e9,
        bps: 1, kbps: 1000, mbps: 1e6, gbps: 1e9
    };

    let bitsMensaje = tamanoMensaje * conversion[unidadTamano];
    let bitsPorSegundo = velocidadTransmision * conversion[unidadVelocidad];

    let tiempo = bitsMensaje / bitsPorSegundo;
    document.getElementById("tiempoTransmision").value = tiempo.toFixed(4);
}

