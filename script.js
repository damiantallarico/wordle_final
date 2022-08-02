window.onload = function() {

    // Variables
    var fila = 1;
    var letra = 1;
    var palabra = document.querySelectorAll('.renglon_palabras');
    var palabra_del_dia;
    var palabra_del_dia_sin_acento;
    var fin_del_juego = false;
    var Jugar = 0;
    var nombre_jugador;
    var reloj_actual;
    var tablero_letras = [];
    var partida_cargada = false;

    // Vriables para el modal
    var modal_ganador = document.getElementById("modal_ganador");
    var modal_perdedor = document.getElementById("modal_perdedor");

    var url = 'https://wordle.danielfrg.com/words/5.json';

    // fetch para obtener el listado de palabras 
    function get_palabra() {
        fetch(url).then(response => {
            response.json().then(data => {
                palabra_del_dia = data[Math.floor(Math.random()*data.length)].toUpperCase()
                palabra_del_dia_sin_acento = eliminarDiacriticosEs(palabra_del_dia)
                console.log('La palabra del día en mayúsculas y sin acento es: '+palabra_del_dia_sin_acento)
            })
        })
        .catch(error => mostrarError(error))
        var mostrarError = (error)  => {
           console.log(error)
        }
    }
    get_palabra();
    
    // Elimina los signos diacríticos de un texto excepto si es una "ñ"
    function eliminarDiacriticosEs(texto) {
        return texto
        .normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
        .normalize();
    }
    
    // Variable para ver que botón se presiona
    var botones = document.querySelectorAll('button');

    // Loop parar ver que botón se presionó.
    botones.forEach((elemento) => {
        elemento.addEventListener('click', function(){
            var boton_presionado = elemento.attributes["data-key"].value; 
            tecla_presionada(boton_presionado)
        })
    });

    // Sellecionar acción a realizar en función de la tecla que se haya seleccionado en el teclado en pantalla.
    function tecla_presionada(x){
        if (!fin_del_juego){
            if (x == "Jugar" && Jugar == 1) {
                alert("Ya hay una partida en curso, termínela antes de iniciar una nueva!");        
            } else {
                if (x == "Jugar") {
                    if (!partida_cargada) {
                        nombre_jugador = window.prompt("Ingrese su nombre por favor:");
                    }
                    Jugar = 1;
                    inicio_reloj();
                    partidas_jugadas();
                } else if (x == "Contacto") {
                    window.location.href="index_contacto.html"
                } else if (x === "Enviar" && Jugar == 1){
                    enviarPalabra();
                } else if (x === "Borrar" && Jugar == 1){
                    borrar_letra();
                } else if (x == "Guardar" && Jugar == 1){
                    guardar_partida();
                } else if (x == "Cargar"){
                    cargar_partida();
                } else if (Jugar == 1) {
                    rellenar_letra(x);
                } else {
                    alert("Deber presionar el botón Jugar para comenzar!");
                }
            }
        } else {
            alert ('Fin del juego!');
            window.location.reload();
        }
    }

    // Capturar el valor del reloj
    function capturar_reloj(){
        var H = document.getElementById("Horas");
        var M = document.getElementById("Minutos");
        var S = document.getElementById("Segundos");
        var C = document.getElementById("Centesimas");
        reloj_actual = [H.innerText,M.innerText,S.innerText,C.innerText];
    }

    //Caragr el reloj recuperado
    function cargar_reloj_recuperado(x){
        document.getElementById("Horas").innerHTML = x[0];
        document.getElementById("Minutos").innerHTML = x[1];
        document.getElementById("Segundos").innerHTML = x[2];
        document.getElementById("Centesimas").innerHTML = x[3];
    }

    // Capturar el tablero
    function capturar_tablero(){
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                var L = document.getElementById("r"+i+"c"+j);
                //var k = 0;
                tablero_letras.push(L.innerText);                
            }
        }
    }

    // Caragr tablero recuperado
    function cargar_tablero(x){
        var k = 0;
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                if (x[k] == "") {
                    fila = i+1;
                    letra = j+1;
                    j = 5;
                    i = 6;
                } else {
                    document.getElementById("r"+i+"c"+j).innerHTML = x[k];
                    k += 1;
                    //console.log(j);
                    if (j == 4) {
                        letra = 6;
                        enviarPalabra();
                    }
                }
            }
        }
    }

    // Guardar partida
    function guardar_partida(){
        parar_reloj();
        capturar_reloj();
        capturar_tablero();
        var partidas_guardadas_t = window.localStorage.getItem("partidas_guardadas");
        if (partidas_guardadas_t == null) {
            var partidas_guardadas = 1;
            window.localStorage.setItem("partidas_guardadas",partidas_guardadas);
        } else {
            partidas_guardadas = Number.parseInt(partidas_guardadas_t);
            partidas_guardadas += 1;
            window.localStorage.setItem("partidas_guardadas",partidas_guardadas);
        }
        var partida = new Object();
        partida.numero_de_partida = partidas_guardadas;
        partida.nombre_del_jugador = nombre_jugador;
        partida.palabra_del_dia_sin_acento = palabra_del_dia_sin_acento;
        partida.reloj_actual = reloj_actual;
        partida.tablero_actual = tablero_letras;
        window.localStorage.setItem("Partida Actual", JSON.stringify(partida));
        partidas_guardadas += 1;
        alert("La partida ha sido guardad!");
        window.location.reload();
    }

    // Cargar partida
    function cargar_partida(){
        var partida_recuperada = JSON.parse(localStorage.getItem("Partida Actual"));
        nombre_jugador = partida_recuperada.nombre_del_jugador;
        palabra_del_dia_sin_acento = partida_recuperada.palabra_del_dia_sin_acento;
        console.log('La palabra del día recuperada de la partida caragada es: '+palabra_del_dia_sin_acento);
        reloj_actual = partida_recuperada.reloj_actual;
        cargar_reloj_recuperado(reloj_actual);
        tablero_letras = partida_recuperada.tablero_actual;
        cargar_tablero(tablero_letras);
        partida_cargada = true;
    }

    // Rellenar el casillero con la letra seleccionada en el teclado en pantalla.
    function rellenar_letra(x){
        if (letra < 6){
            palabra[fila-1].querySelectorAll('.letra')[letra-1].innerText = x;
            letra += 1;
        }
    }

    // Borrar la última letra ingresada.
    function borrar_letra(){
        var letras = palabra[fila-1].querySelectorAll('.letra');
        for (var i = letras.length-1; i >= 0; i--) {
            var j = letras[i];
            if (j.innerText !== ''){
                j.innerText = '';
                letra -= 1;
                break;
            }
        }
    }

    // Enviar palabra a comparar con la palabra del día.
    function enviarPalabra(){
        if (letra < 6) {
            alert("Debe completar las 5 letras antes de Enviar!");
        } else {
            compararPalabra();
            fila += 1;
            letra = 1;
        }
    }

    // Comparar la palabra ingresada con la palabra del día.
    function compararPalabra(){
        // Letras ingresadas en el renglón.
        var letras = palabra[fila-1].querySelectorAll('.letra');
		
        // Variable auxiliar para contar letas correctas.
		var letras_correctas = 0;

        // Por defecto pinto todos los casilleros de Gris.
        for (var k = 0; k < letras.length; k++) {
            letras[k].classList.add('letra_gris');            
        }

        // Verifico si tengo que cambiar el color del casillero por verde o por amarillo.
        for (var i = 0; i < letras.length; i++) {
            if (letras[i].innerText === palabra_del_dia_sin_acento[i]) {
			    letras_correctas += 1;
                letras[i].classList.remove ('letra_gris');
                letras[i].classList.add('letra_verde');
            } else {
                for (var j = 0; j < palabra_del_dia_sin_acento.length; j++) {
                    if (letras[i].innerText == palabra_del_dia_sin_acento[j]) {
                        letras[i].classList.remove ('letra_gris');
                        letras[i].classList.add('letra_amarilla');
                    }             
                }
            }
        }
 
        // Acá me fijo si llegamos a las 5 letras correctas y finaliza el juego.
        if(letras_correctas === 5){
            fin_del_juego = true;
            parar_reloj();
            modal_ganador.style.display = "block";
            // y si llegó a los 6 intentos sin llegar a las 5 letras correctas también finaliza el juego.
        } else if (fila === 6){
            fin_del_juego = true;
            parar_reloj();
            modal_perdedor.style.display = "block";
        }
    }
    
    // Hacer clic en cualquier lugar de la pantalla para cerrar el modal
    window.onclick = function(event) {
        if (event.target == modal_ganador || event.target == modal_perdedor) {
            modal_ganador.style.display = "none";
            modal_perdedor.style.display = "none";
        }
    }

    // Reloj
    var centesimas = 0;
    var segundos = 0;
    var minutos = 0;
    var horas = 0;
    var Centesimas = document.getElementById("Centesimas");
    var Segundos = document.getElementById("Segundos");
    var Minutos = document.getElementById("Minutos");
    var Horas = document.getElementById("Horas");

    function inicio_reloj () {
        control = setInterval(cronometro,10);
    }
    function parar_reloj () {
        clearInterval(control);
    }
    
    function cronometro () {
        if (centesimas < 99) {
            centesimas++;
            if (centesimas < 10) {
                centesimas = "0"+centesimas;
            }
            Centesimas.innerHTML = ":"+centesimas;
        }
        if (centesimas == 99) {
            centesimas = -1;
        }
        if (centesimas == 0) {
            segundos ++;
            if (segundos < 10) {
                segundos = "0"+segundos;
            }
            Segundos.innerHTML = ":"+segundos;
        }
        if (segundos == 59) {
            segundos = -1;
        }
        if ((centesimas == 0) && (segundos == 0)) {
            minutos++;
            if (minutos < 10) {
                minutos = "0"+minutos;
            }
            Minutos.innerHTML = ":"+minutos;
        }
        if (minutos == 59) {
            minutos = -1;
        }
        if ((centesimas == 0) && (segundos == 0) && (minutos == 0)) {
            horas ++;
            if (horas < 10) {
                horas = "0"+horas;
            }
            Horas.innerHTML = horas;
        }
    }
}