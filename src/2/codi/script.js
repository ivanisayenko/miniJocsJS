var cant = 0, rojos = 0, azules = 0, perdido = false, interval, tardado = 0;

function generarDivs(cant) {
    var rojo = true;
    var div = document.getElementById("generarDivs");
    for (var i = 0; i < cant; i++) {
        var divCreado = document.createElement("DIV");
        divCreado.style.position = "absolute";
        divCreado.style.top = parseInt(Math.random() * 350) + 320 + "px";
        divCreado.style.left = parseInt(Math.random() * (div.offsetWidth - 80) + 20) + "px";
        divCreado.style.width = "40px";
        divCreado.style.height = "40px";
        divCreado.style.background = rojo ? "red" : "blue";
        divCreado.id = rojo ? "divRojo" + i : "divAzul" + i;
        divCreado.className = rojo ? "divRojo" : "divAzul";
        divCreado.style.cursor = "move";
        divCreado.setAttribute('draggable', true);
        if (rojo) {
            rojos++;
            rojo = false;
        } else {
            azules++;
            rojo = true;
        }
        div.append(divCreado);
    }
}
function drag(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "copy";
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var divMover = document.getElementById(data);
    divMover.style.top = event.clientY + "px";
    divMover.style.left = event.clientX + "px";
    ev.target.appendChild(divMover);
    comrpobarColores("rojos");
    comrpobarColores("azules");
    juegoTerminado();

}

function comrpobarColores(color) {
    var cont = 0;
    var elemento = document.getElementById(color);
    let hijo = color == "rojos" ? "divRojo" : "divAzul";
    for (let hijos of elemento.childNodes) {
        if (hijos.nodeType != Node.TEXT_NODE && hijos.className == hijo) {
            cont++;
        }
    }
    if (color == "rojos") {
        rojos = rojos == cont ? true : rojos;
    } else {
        azules = azules == cont ? true : azules;
    }
}

function juegoTerminado() {
    if (rojos === true && azules === true && !perdido) {
        alert("felicidades, has terminado el juego a tiempo");
        document.getElementById("tardado").innerHTML = "Has tardado: " + tardado.toFixed(1) + " segundos";
        clearTimeout(interval);
        perdido = true;
    }
}

function iniciarElTiempo() {
    let tiempo = ((cant * 1.5) * 1000);
    alert("Tienes " + tiempo / 1000 + " segundos para completar el juego");
    restarTiempo(tiempo);
    setTimeout(function () {
        if (rojos != true || azules != true) {
            alert("has perdido, no te ha dado tiempo");
            rojos = true;
            azules = true;
            perdido = true;
            clearTimeout(interval);
        }
    }, tiempo);
}

function restarTiempo(tiempo) {
    let segundos = (tiempo / 1000) - 0.2;
    interval = setInterval(function () {
        document.getElementById("segundos").innerHTML = "Te quedan: " + segundos.toFixed(1) + " segundos";
        segundos -= 0.1;
        tardado += 0.1;
    }, 100);
}

window.onload = () => {
    cant = prompt("Cuantos elementos queires generar?");
    while (isNaN(cant)) {
        cant = prompt("Introduce una cuantidad numerica !");
    }
    generarDivs(cant);
    iniciarElTiempo()
    for (let valor of document.querySelectorAll(".divRojo")) {
        valor.addEventListener("dragstart", drag);
    }
    for (let valor of document.querySelectorAll(".divAzul")) {
        valor.addEventListener("dragstart", drag);
    }
    document.getElementById("generarDivs").addEventListener("drop", drop);
    document.getElementById("generarDivs").addEventListener("dragover", allowDrop);
    document.getElementById("juego").addEventListener("drop", drop);
    document.getElementById("juego").addEventListener("dragover", allowDrop);
}