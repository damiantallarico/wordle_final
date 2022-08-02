window.onload = function() {
    // Validar el Submit
    document.getElementById("formulario").addEventListener('submit', validar);

    // Variables
    var nombre = document.getElementById('nombre');
    var error_nombre = document.getElementById('error_nombre');
    var apellido = document.getElementById('apellido');
    var error_apellido = document.getElementById('error_apellido');
    var mail = document.getElementById('mail');
    var error_mail = document.getElementById('error_mail');
    var comentario = document.getElementById('comentario');
    var error_comentario = document.getElementById('error_comentario');
    var numRegex =/^[0-9]+$/;
    var mailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    var datos_ok = [];
    var mail_comentarios = "damian.tallarico@alumnos.uai.edu.ar";
    var mail_titulo = "Consulta - General - Wordle";

    // Validaciones
    function validar(evento){
        evento.preventDefault();
        setear_obligatorios(nombre);
        setear_obligatorios(apellido);
        setear_obligatorios(mail);
        setear_obligatorios(comentario);
        longitud(nombre,error_nombre);
        longitud(apellido,error_apellido);
        longitud(comentario,error_comentario);
        validar_mail(mail,error_mail);
        validar_datos(datos_ok);
    }

    // Función para setear obligatorios
    function setear_obligatorios(x){
        x.setAttribute('required','true');
    }
    
    // Funciones de validaciones
    function longitud(x,y){
        if(numRegex.test(x.value)){
            y.classList.remove('esconder_error');
        }else{
            if(x.value.length < 3 || x.value.length > 15){
                y.classList.remove('esconder_error');
                datos_ok[0]=false;
            }else{
                datos_ok[0]=true;
            }
        }
    }
    function validar_mail(x,y){
        if (!mailRegex.test(x.value)) {
            y.classList.remove('esconder_error');
            datos_ok[1]=false;
        }else{
            datos_ok[1]=true;
        }
    }
    
    function validar_datos(x){
        var long_array = x.length;
        var i = 0;
        var b = 0;
        for(i; i<long_array; i++){
            if(x[i] == true){
                b++;
            }
        }
        if(b == long_array){
            window.open('mailto:'+mail_comentarios+'?subject='+mail_titulo+'&body='+comentario.value+"%0A"+"%0A"+nombre.value+"%20"+apellido.value);
            b=0;
        }
    }

    // Eventos para "limpiar" errores
    nombre.addEventListener('focus',limpiar_error);
    apellido.addEventListener('focus', limpiar_error);
    mail.addEventListener('focus',limpiar_error);
    comentario.addEventListener('focus',limpiar_error);

    // Función para limpiar error
    function limpiar_error(){
        var error_activo = "error_" + document.activeElement.name;
        var er = document.getElementById(error_activo);
        er.classList.add('esconder_error');
    } 
}