window.onload = () => {
    juego();
    document.getElementById("reinciciar").addEventListener("click", function(){
        reiniciar();
        juego();
        cantNotasAdivinar = 3;
    });
}
var sonidos = [new Audio('sons/do.wav'),
new Audio('sons/re.wav'),
new Audio('sons/mi.wav'),
new Audio('sons/fa.wav'),
new Audio('sons/sol.wav'),
new Audio('sons/la.wav'),
new Audio('sons/si.wav')];
var notasAdivinar = [];
var notasJugador = [];
var cantNotasAdivinar = 3;
var juegoTerminado = false;

function hoverOn(e){
    if(!juegoTerminado){
        this.style.background = "#ef5777";
        this.style.cursor = "pointer";
        this.style.border = "2px solid #d2dae2";
        this.style.boxShadow = "2px 2px 2px 2px #1e272e";
    }
}

function hoverOff(e){
    this.style.background = "#ff5e57";
    this.style.border = "2px solid #1e272e";
    this.style.boxShadow = "2px 2px 2px #1e272e";
}

function generarSonsAleatoris(cant, tiempo) {
    let contador = 0;
    var generar = setInterval(function () {
        juegoTerminado = true;
        document.getElementById("reinciciar").disabled = true;
        contador++;
        let random = parseInt(Math.random() * (16 - 1) + 1);
        let div = document.getElementById("d" + random);
        notasAdivinar.push("d"+random);
        div.style.background = "white";
        sonidos[div.getAttribute("name")].play();
        setTimeout(function () {
            div.style.background = "#ff5e57";
        }, tiempo / 2);
        if (contador == cant) {
            clearTimeout(generar);
            juegoTerminado = false;
            document.getElementById("reinciciar").disabled = false;
        }
    }, tiempo);
}

function click(e) {
    if(!juegoTerminado){
        sonidos[this.getAttribute("name")].play();
        if (notasJugador.length != cantNotasAdivinar - 1) {
            notasJugador.push(this.id);
        } else {
            notasJugador.push(this.id);
            comprobarOrdenNotas();
        }
        console.log("Notas generadas aleatorias: "+notasAdivinar);
        console.log("Notas del jugador: "+notasJugador);
    }
}

function comprobarOrdenNotas() {
    if (notasJugador.indexOf(null) != -1 || notasAdivinar.join("") != notasJugador.join("")) {
        mensaje();
        juegoTerminado = true;
    } else if(notasAdivinar.join("") == notasJugador.join("")){
        cantNotasAdivinar++;
        mensaje(true);
        document.getElementById("missatges").innerHTML += "<br>Preparat per la seguent ronda";
        reiniciar();
        setTimeout(function(){
            generarSonsAleatoris(cantNotasAdivinar, 1000);
        },1000);

    }
}

function reiniciar(){
    notasAdivinar = [];
    notasJugador = [];
}

function mensaje(correcto = false){
    var mensaje = document.getElementById("missatges");
    mensaje.innerHTML = correcto ? "Has acertat!": "Has fallat!";
    mensaje.style.color = correcto ? "green" : "red";
    mensaje.style.fontSize = "30px";
    mensaje.style.fontWeight = "bold";
    setTimeout(function(){
        mensaje.innerHTML = "";
    }, 5000);

}

function juego() {
    generarSonsAleatoris(cantNotasAdivinar, 1000);
    let divs = document.querySelectorAll(".nota");
    for (let nota of divs) {
        nota.addEventListener("click", click);
        nota.addEventListener("mouseover", hoverOn);
        nota.addEventListener("mouseout", hoverOff);
    }
}
