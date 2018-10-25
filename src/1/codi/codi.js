var rojo = true, terminado = false;
function dibujarArea() {
    d3.select('body').append('svg').attr('width', 436).attr("height", 375);
    var svg = d3.select('svg');
    var defs = svg.append('defs');
    defs.append("circle").attr("id", "circuloBlanco").attr("cx", 0).attr("cy", 0).attr("r", 30);
    for (var x = 0; x < 6; x++) {
        for (var i = 0; i < 7; i++) {
            svg.append('use').attr("href", "#circuloBlanco").attr("x", (62 * i) + 32).attr("y", (62 * x) + 32).attr("id", "p" + String(x) + String(i)).attr("fill", "white");
        }
    }
}
function focus() {
    d3.selectAll('use').on("mouseover", function () {
        var clase = this.className.baseVal;
        if (clase != "rojo" && clase != "verde") {
            var columna = this.id[2];
        }
        d3.selectAll('use').each(function (d, i) {
            clase = this.className.baseVal;
            if (this.id[2] == columna && clase != "rojo" && clase != "verde") {
                if (rojo) {
                    d3.select(this).attr("fill", "#ffb3b3");
                } else {
                    d3.select(this).attr("fill", "#BFFDB2");
                }
            }
        });
    }).on("mouseout", function () {
        d3.selectAll('use').each(function (d, i) {
            clase = this.className.baseVal;
            if (clase != "rojo" && clase != "verde") {
                d3.select(this).attr("fill", "white");
            }
        });
    });
}
function comprobarAsincrono() {
    comprobacionLineas(6, 4, true);
    comprobacionLineas(7, 3, false);
    if (!terminado) {
        comprobacionDiagonal();
    }
}
function click() {
    d3.selectAll('use').on("click", function () {
        var clase = this.className.baseVal;
        if (clase != "rojo" && clase != "verde" && !terminado) {
            var columna = this.id[2], fila = 0;
            d3.selectAll('use').each(function (d, i) {
                clase = this.className.baseVal;
                if (this.id[2] == columna && clase != "rojo" && clase != "verde") {
                    fila = this.id[1] > fila ? this.id[1] : fila;
                }
            });
            if (rojo) {
                rojo = false;
                d3.select("svg").append("circle").attr("fill", "tomato").attr("r", 30).attr("cx", (62 * columna) + 32).attr("cy", 32).attr("id", "circuloMovimiento")
                    .transition().duration(500).ease(d3.easeBounce).attr("transform", `translate(${0}, ${(62 * fila)})`).on("end", function () {
                        d3.select(`#p${fila}${columna}`).attr("fill", "tomato").attr('class', "rojo");
                        this.remove();
                        comprobarAsincrono();
                    });
            } else {
                rojo = true;
                d3.select("svg").append("circle").attr("fill", "LIMEGREEN").attr("r", 30).attr("cx", (62 * columna) + 32).attr("cy", 32).attr("id", "circuloMovimiento")
                    .transition().duration(500).ease(d3.easeBounce).attr("transform", `translate(${0}, ${(62 * fila)})`).on("end", function () {
                        d3.select(`#p${fila}${columna}`).attr("fill", "LIMEGREEN").attr('class', "verde");
                        this.remove();
                        comprobarAsincrono();
                    });
            }
        } else if (terminado) {
            alert("la partida ya esta terminada");
        } else {
            alert("ya esta en uso");
        }
    });
}
function marcar4Juntos(i, x, horizontal) {
    for (let v = 0; v < 4; v++) {
        var circulo = horizontal ? d3.select(`#p${i}${x + v}`) : d3.select(`#p${x + v}${i}`);
        circulo.attr("stroke", "black").style("stroke-width", 2);

    }
}
function comprobacionLineas(fila, columna, horizontal) {
    var rojo = 0, verde = 0;
    for (let i = 0; i < fila; i++) {
        for (let x = 0; x < columna; x++) {
            for (let v = 0; v < 4; v++) {
                var circulo = horizontal ? document.getElementById(`p${i}${x + v}`) : document.getElementById(`p${x + v}${i}`);
                if (circulo.id == "white") {
                    break;
                } else {
                    rojo = circulo.className.baseVal == "rojo" ? rojo + 1 : rojo;
                    verde = circulo.className.baseVal == "verde" ? verde + 1 : verde;
                }
            }
            if (rojo == 4) {
                alert("los rojos han ganado");
                marcar4Juntos(i, x, horizontal);
                terminado = true;
                //esta igualacion de i provoca el error que no afecta al juego, porque solo sucede cuando acaba la paritda
                i = fila;
            } else if (verde == 4) {
                marcar4Juntos(i, x, horizontal);
                alert("los verdes han ganado");
                terminado = true;
                //esta igualacion de i provoca el error
                i = fila;
            } else {
                rojo = 0;
                verde = 0;
                terminado = false;
            }
        }
    }
}
function comprobacionDiagonal() {
    var verde = 0, rojo = 0;
    // filas diagonales derecha
    for (var i = 0; i < 3; i++) {
        for (var v = 0; v < 4; v++) {
            for (var x = 0; x < 4; x++) {
                var fila = i, columna = v, circulo = document.getElementById(`p${fila + x}${columna + x}`);
                if (circulo.className.baseVal == 'verde') {
                    verde++;
                } else if (circulo.className.baseVal == 'rojo') {
                    rojo++;
                }
            }
            let res = mirar4JuntosDiagonal(rojo, verde, i, v, "derecha");
            if (!res) {
                rojo = 0;
                verde = 0;
            }
        }
    }
    //filas diagonales izquierda
    for (var i = 0; i < 3; i++) {
        for (var v = 6; v >= 3; v--) {
            for (var x = 0; x < 4; x++) {
                var fila = i, columna = v, circulo = document.getElementById(`p${fila + x}${columna - x}`);
                if (circulo.className.baseVal == 'verde') {
                    verde++;
                } else if (circulo.className.baseVal == 'rojo') {
                    rojo++;
                }
            }
            let res = mirar4JuntosDiagonal(rojo, verde, i, v, "izquierda");
            if (!res) {
                rojo = 0;
                verde = 0;
            }
        }
    }
}
function mirar4JuntosDiagonal(rojo, verde, i, v, direccion) {
    if (rojo == 4) {
        alert("los rojos han ganado (izquierda-decreciente)");
        marcar4JuntosDiagonal(i, v, direccion);
        terminado = true;
        //esta igualacion de i provoca el error que no afecta al juego, porque solo sucede cuando acaba la paritda
        i = 3;
    } else if (verde == 4) {
        alert("los verdes han ganado (izquierda-decreciente)");
        marcar4JuntosDiagonal(i, v, direccion);
        terminado = true;
        //esta igualacion de i provoca el error
        i = 3;
    } else {
        terminado = false;
    }
    return false;
}
function marcar4JuntosDiagonal(i, x, direccion) {
    for (let v = 0; v < 4; v++) {
        var circulo = direccion == "derecha" ? d3.select(`#p${i + v}${x + v}`) : d3.select(`#p${i + v}${x - v}`);
        circulo.attr("stroke", "black").style("stroke-width", 2);
    }
}
window.onload = () => {
    dibujarArea();
    focus();
    click();
}

