// ------------------VARIABLES------------------
//es genera una array que simula el camp de joc i on es desaran els jugades
var camp = generarArray();
//variable que ens ajuda identificar quin element es posa en la tabla del joc
var creu = true;
//variable qeu ens ajuda identificar quants elements hi ha en la tabla del joc
var ple = 0;
//varibale que defienxi si la partida ha terminat o no
var partidaTerminada = false;
// variable que ddiferencia si juguem contra pc o un altre jugador
var isOrdinador = false;
//varibale que desa qui ha fet la primera jugada, per mostrar posterirment un misstage correcte
var primeraJugada;


// ------------------FUNCIONS------------------
// funcio que diferencia contra qui juguem
function juguemContra() {
    let id = document.getElementsByTagName('body')[0].id;
    if (id == 'ordinador') {
        isOrdinador = true;
    }
}

//funcio que genera array del camp de joc
function generarArray() {
    var zonaJoc = [];
    for (let i = 0; i < 3; i++) {
        let fila = [];
        zonaJoc[i] = fila;
    }
    return zonaJoc;
}

//funció que selecciona el camps on esta el rato
function marcarZonaSeleccionada() {
    document.addEventListener("mouseover", function (e) {
        if (e.target.tagName == "rect" && e.target.id != "creu") {
            let id = e.target.id[1];
            let fila = id % 3;
            if (!isPosicioOcupada(id)) {
                d3.select(e.target).style("stroke", "#C5DFF3");
            } else {
                d3.select(e.target).style("stroke", "tomato");
            }
        }
    });
    document.addEventListener("mouseout", function (e) {
        if (e.target.tagName == "rect") {
            d3.select(e.target).style("stroke", "none");
        }
    });
}

//comproba si una posicó esta ocupada en la array
function isPosicioOcupada(id) {
    let resultat = true;
    if (id < 4) {
        if (camp[0][id - 1] == null) {
            resultat = false;
        }
    } else if (id < 7 && id > 3) {
        if (camp[1][id - 4] == null) {
            resultat = false;
        }
    } else {
        if (camp[2][id - 7] == null) {
            resultat = false;
        }
    }
    return resultat;
}

//si es posa un nou element (X / O), es quedara reflectat en la array
//per controlar els ganadors o empats
function marcarPosicioArray(id, figura) {
    if (id < 4) {
        camp[0][id - 1] = figura;
    } else if (id < 7 && id > 3) {
        camp[1][id - 4] = figura;
    } else {
        camp[2][id - 7] = figura;
    }
}

//calculem la posicio on es situara l'element depenent d'on es fara click
function calcularPosicion(id) {
    if (id < 4) {
        fila = 50;
        columna = ((id - 1) * 100) + 50;
    } else if (id < 7 && id > 3) {
        fila = 150;
        columna = ((id - 4) * 100) + 50;
    } else {
        fila = 250;
        columna = ((id - 7) * 100) + 50;
    }
}

//funcio que genera rectangle
function generarRectnagle(w, h, x, y, r, color = "#00E1FF", id = "rect") {
    d3.select("svg").append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("id", id)
        .attr("transform", `translate(${x},${y}) rotate(${r})`)
        .style("fill", color);
}

//genera svg X en el camp del joc
function generarX(id) {
    calcularPosicion(id);
    generarRectnagle(87, 10, columna - 27, fila - 35, 45, "rgb(58, 109, 239)", "creu");
    generarRectnagle(87, 10, columna + 34, fila - 28, 135, "rgb(58, 109, 239)", "creu");
    marcarPosicioArray(id, "x");
}

//genera svg O en el camp del joc
function generarO(id) {
    calcularPosicion(id);
    d3.select("svg").append("circle")
        .attr("cx", columna)
        .attr("cy", fila)
        .attr("r", 38)
        .attr("id", "cercle")
        .attr("stroke-width", 10)
        .style("stroke", "#00E1FF")
        .style("fill", "#31A3FC");
    marcarPosicioArray(id, "o");
}

//funcio que dibuixa ratlla si hi ha 3 elements junts
function dibuixatrRatlla(fila, columna, i) {
    let radi = 0;
    let x = 0;
    let y = (i * 98) + 51;
    let width = 300;
    if (fila == "x" && fila != columna) {
        radi = 90;
        x = (i * 100) + 51;
        y = 0;
    } else if (fila == columna) {
        x = 2;
        y = 0;
        radi = 45;
        width = 420;
    }
    generarRectnagle(width, 2, x, y, radi, "tomato", "ratlla");
}

//funcio que comprova els elements i imprimeix els misstages dels guanyadors
//si es guanya la partida, aquesta s'acaba
function comprobarTresElements(quantitatX, quantitatO) {
    var partidaTerminada = false;
    if (quantitatX == 3) {
        if (isOrdinador) {
            alert("Ha guanyat " + document.getElementById("nomJug1").value);
        } else {
            alert("Ha guanyat " + document.getElementById("nomJug" + primeraJugada).value);
        }
        partidaTerminada = true;
    } else if (quantitatO == 3) {
        if (isOrdinador) {
            alert("Felicitats, t'ha gunayat una inteligencia artificial tonta, però molt tonta");
        } else {
            let jugador = primeraJugada == 1 ? 2 : 1;
            alert("Ha guanyat " + document.getElementById("nomJug" + jugador).value);
        }
        partidaTerminada = true;
    }
    return partidaTerminada;
}

//comprobacio de files, columnas i fila diagonal sentit dreta
function comprobacioFilesColumnes(fila, columna) {
    let quantitatX = 0;
    let quantitatO = 0;
    let partidaTerminada;
    for (let i = 0; i < 3; i++) {
        for (let x = 0; x < 3; x++) {
            if (camp[eval(fila)][eval(columna)] != null) {
                if (camp[eval(fila)][eval(columna)] == "x") {
                    quantitatX++;
                } else {
                    quantitatO++;
                }
            }
            partidaTerminada = comprobarTresElements(quantitatX, quantitatO);
        }
        if (partidaTerminada) {
            dibuixatrRatlla(fila, columna, i);
            i = 3;
        }
        quantitatX = 0;
        quantitatO = 0;
    }
    return partidaTerminada;
}

//comprobacio de fila diagonal en sentit esquerre
function comprobacioDiagonal() {
    let quantitatX = 0;
    let quantitatO = 0;
    var posicions = [2, 1, 0];
    for (let i = 0; i < 3; i++) {
        if (camp[i][posicions[i]] != null) {
            if (camp[i][posicions[i]] == "x") {
                quantitatX++;
            } else {
                quantitatO++;
            }
        } else {
            break;
        }
    }
    let partidaTerminada = comprobarTresElements(quantitatX, quantitatO);
    if (partidaTerminada) {
        generarRectnagle(420, 2, 300, 0, 135, "tomato", "ratlla");
    }
    return partidaTerminada;
}

//comprovar si hi ha tres elements junts
function tresElementsJunts() {
    var comprovar = ['comprobacioFilesColumnes("i", "x")',
        'comprobacioFilesColumnes("x", "i")',
        'comprobacioFilesColumnes("x", "x")',
        //no es pot reutilitzar comprobacioFilesColumnes per comprobar
        //la fila diagonal sentit esquerre, si no la funció seria molt expensiva
        'comprobacioDiagonal()'];
    let partidaTerminada;
    let n = 0;
    while (!partidaTerminada && n != comprovar.length) {
        partidaTerminada = eval(comprovar[n]);
        n++;
    }
    return partidaTerminada;
}

function empat(partidaTerminada) {
    if (ple == (camp.length * 3) && !partidaTerminada) {
        alert("Ningu ha guanyat");
    }
}

//funció que defineix qui fa la primera jugada
function escollirPrimeraJugada() {
    document.getElementsByName("iniciarPrimer")[0].addEventListener("click", function () {
        document.getElementById("juego").style.display = "block";
        let jugador = parseInt(Math.random() * (3 - 1) + 1);
        primeraJugada = jugador;
        alert("Comença a jugar " + document.getElementById("nomJug" + jugador).value);
    });

}

//funcio que reinicia totes les varibales necesaris per el joc
function reiniciarJoc() {
    document.getElementsByName("reiniciar")[0].addEventListener("click", function () {
        d3.select("#ratlla").remove();
        d3.selectAll("#creu").remove();
        d3.selectAll("#cercle").remove();
        camp = generarArray();
        creu = true;
        ple = 0;
        partidaTerminada = false;
    });
}

// funcio que fa la jugada del pc
function jugadaOrdinador() {
    let random = parseInt(Math.random() * (8 - 1) + 1);
    console.log('generado:' + random);
    while (isPosicioOcupada(random)) {
        random = parseInt(Math.random() * (9 - 1) + 1);
        console.log('generado:' + random);
    }
    calcularPosicion(random);
    generarO(random);
}

//funcio que suma la varibale i comproba si la partida s'ha terminat o no
function comprobarEstatPartida() {
    partidaTerminada = tresElementsJunts();
    ple++;
    empat(partidaTerminada);
}

//funcio qeu controla si fem click al rect desitjat
function isRectInteract(e) {
    if (e.target.tagName == "rect" && e.target.id != "creu") {
        return true;
    } else {
        return false;
    }
}

//funcio que verifica si es fi de la partida o no
function isFinPartida() {
    if (!partidaTerminada && ple != (camp.length * 3)) {
        return false;
    } else {
        return true;
    }
}

//funció principal del joc
function clickJugador() {
    let fila;
    let columna;
    document.addEventListener("click", function (e) {
        let id = e.target.id[1];
        if (isRectInteract(e)) {
            if (!isFinPartida()) {
                if (!isPosicioOcupada(id)) {
                    console.log('donde doy click: ' + id);
                    if (creu) {
                        generarX(id);
                        comprobarEstatPartida();
                        creu = false;
                        if (isOrdinador && !isFinPartida()) {
                            jugadaOrdinador();
                            comprobarEstatPartida();
                            creu = true;
                        }
                    } else {
                        generarO(id);
                        comprobarEstatPartida();
                        creu = true;
                    }
                } else {
                    alert("ja esta ocupat");
                }
            } else {
                alert("La partida ja es terminada");
            }
        }
    });
}

// ------------------MAIN------------------
window.onload = () => {
    if (document.getElementsByTagName("body")[0].id == "jugador") {
        document.getElementById("juego").style.display = "none";
    }
    juguemContra();
    escollirPrimeraJugada();
    marcarZonaSeleccionada();
    clickJugador();
    reiniciarJoc();
}