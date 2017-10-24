// var app = {
//     buscarTodo: function(){
//         buscarTodo();
//     }
// }

$(document).ready(function () {
    // Ejemplo consulta a la api
    // http://netflixroulette.net/api/api.php?title=The%20Boondocks&year=2005&type=plain
    var API_URL = "http://netflixroulette.net/api/api.php?";
    $("#btnUpdateWhat").click(buscarTodo);

    //codigo para buscar cualquier cosa
    function buscarTodo() {
        var txtBusqueda = $("#searchField").val().replace(/\s/ig, "%20");
        var txtQuery;
        var tipo;
        $("#filmList").empty();

        // Considerando los filtros
        var filtro = $("input:checked").attr("id");
        if (filtro != "chkbox_none" && filtro != null) {
            if (filtro == "chkbox_director") {
                txtQuery = API_URL + "director=" + txtBusqueda;
                tipo = "director";
            }

            if (filtro == "chkbox_actor") {
                txtQuery = API_URL + "actor=" + txtBusqueda;
                tipo = "actor";
            }

            // Comentado por no encontrar la busqueda por genero en la api
            // if ($("#chkbox_genero").checked) {
            //     var txtTestDir = API_URL + "genero=" + txtBusqueda;
            // }

            if (filtro == "chkbox_titulo") {
                txtQuery = API_URL + "title=" + txtBusqueda;
                tipo = "titulo";
            }
            buscarListar(txtQuery, tipo);
        } else {
            // si no se especifica el filtro busca por cada opcion y lista una a continuacion de la otra
            var txtQuery = API_URL + "title=" + txtBusqueda;
            tipo = "titulo";
            buscarListar(txtQuery, tipo);
            var txtQuery = API_URL + "actor=" + txtBusqueda;
            tipo = "actor";
            buscarListar(txtQuery, tipo);
            var txtQuery = API_URL + "director=" + txtBusqueda;
            tipo = "director";
            buscarListar(txtQuery, tipo);
        }
    };

    // Hace el request a la api y lista los resultados
    function buscarListar(txtQuery, tipo) {
        $.get({
            url: txtQuery,
            success: function (data) {

                if (tipo == "actor") {
                    $("#filmList").append("<li data-role='list-divider'>Aparece como actor</li>");
                } else if (tipo == "titulo") {
                    $("#filmList").append("<li data-role='list-divider'>Aparece en el titulo</li>");
                    
                     $("#filmList").append("<li id='" + data.show_title + "' class='ui-btn ui-li-has-alt ui-li-has-thumb' ><img src='" + data.poster + "' alt='" + data.show_title + "' /><h6>" + data.show_title + "</h6><p >Año: " + data.release_year + ".  Rating: " + data.rating + ".  Genero: " + data.category + "</p><p >" + data.summary + "</p></li>");
                
                } else if (tipo == "director") {
                    $("#filmList").append("<li data-role='list-divider'>Aparece como director</li>");
                }
                
                if(tipo != "titulo"){
                    $.each(data, function (obj, objPelicula) {
                    //class='ui-btn ui-li ui-li-has-alt ui-li-has-thumb'
                    $("#filmList").append("<li id='" + objPelicula.show_title + "' class='ui-btn ui-li-has-alt ui-li-has-thumb' ><img src='" + objPelicula.poster + "' alt='" + objPelicula.show_title + "' /><h6>" + objPelicula.show_title + "</h6><p >Año: " + objPelicula.release_year + ".  Rating: " + objPelicula.rating + ".  Genero: " + objPelicula.category + "</p><p >" + objPelicula.summary + "</p></li>");
                });
                }  
            },
            error: function (error) {
                $("#filmList").append("<li data-role='list-divider'>La busqueda por " + tipo + " no genero resultados</li>");
            }, function(cosa) {
                alert(cosa);
            }
        });
        $("#filmList").listview('refresh');
    };

    // navega a inicio
    $(".ui-btn-right.irAInicio").click(function(){
        //$.mobile.changePage('#pagina_principal');
        parent.history.back();
    });

    // click en filtros -> toggle de los filtros
    $("#mostrarFiltros").on('click', function () {
        $("#filtros").toggle();
    });

    // click en film -> ver detalles           
    $("#filmList").on('click', 'li', function () {
        var elem = ($(this)).attr('id').replace(/\s/ig, "%20");
        var query = API_URL + "title=" + elem;
        var objPelicula;

        $.get(query, function (data) {

            objPelicula = data;

            $.mobile.changePage('#film_seleccionado');

            $("#imagenPelicula").empty();
            $("#imagenPelicula").append("<img src='" + objPelicula.poster + "' />");
            $("#titulo").text(objPelicula.show_title);
            $("#anioRatingCategoria").text("Año: " + objPelicula.release_year + ". Rating: " + objPelicula.rating + ". Categoria: " + objPelicula.category);
            $("#descripcion").text(objPelicula.summary);
            $("#directorRepartoDuracion").text("Director: " + objPelicula.director + ". Reparto: " + objPelicula.show_cast + ". Duracion: " + objPelicula.runtime);

            cargarListasOptionPanelDePelicula();

            // click heart icon -> Agrega a Favoritos
            $("#agregarAFavoritos").on("click", function () {
                var film = $("#titulo").text();
                agregarALista("Favoritos", objPelicula);
            });

            // click plus icon -> Agrega a otra lista
            $("#listasUsuarioEnPeli").on("click", "option", function () {
                var elem = ($(this)).attr('id');
                agregarALista(elem, objPelicula);
            });
        });
    });

    $.mobile.changePage('#pagina_principal');


    // swipe en film -> ver detalles           
    $("#filmList").on('swiperight', 'li', function () {
        var elem = ($(this)).attr('id').replace(/\s/ig, "%20");
        var query = API_URL + "title=" + elem;
        var objPelicula;

        $.get(query, function (data) {

            objPelicula = data;
            agregarALista("Favoritos", objPelicula);
        });
    });

    function agregarALista(id_lista, obj_pelicula) {
        $.each(mis_listas, function (key, val) {
            if (id_lista == key) {
                var cont;
                $.each(val, function contenido(key1, value) {
                    if (obj_pelicula.show_title == value.show_title) {
                        alert("En lista");
                        cont = true;
                    }
                });
                if (cont != true) {
                    var id_pel = "id_peli" + $.now();
                    val[id_pel] = obj_pelicula;
                    localStorage.setItem("mis_listas", JSON.stringify(mis_listas));
                    alert("La pelicula se ha agregado correctamente");
                }
            }
        });
    };

    // click ver listas -> Navega a la pag de favoritos y listas
    $(".ui-btn-right.btnVerListas").click(function () {
        $.mobile.changePage('#pagina_listas'); //, { role: 'dialog', changeHash: false });
        cargarListasOptionPanel();
    });

    // click plus icon en listas -> Lleva a modal donde agrega otra lista
    $("#nueva_lista").click(function () {
        $.mobile.changePage('#modalAgregarLista', { role: 'dialog', changeHash: false });
        $("#nombreListaTxt").val() = "";
    });

    // agrega solo un elemento string a lista de listas
    $("#nueva_lista_aceptar").click(function () {
        var nombre_lista = $("#nombreListaTxt").val();

        var lista;
        try {
            lista = JSON.parse(localStorage.getItem("mis_listas"));
            //alert("Mis listas tiene: " + lista);
        } catch (err) {
            alert("No existen listas guardadas");
        }

        if (lista == null) {
            // Se crea en localStorage un juego de datos en favoritos
            crearListasPreCargadas();
        }
        else {

            if ($.inArray(nombre_lista, lista) == 1) {
                alert("La lista ya existe");
            }
            else {
                lista[nombre_lista] = {};
                listas_string = JSON.stringify(lista);
                localStorage.setItem("mis_listas", listas_string);
                alert("Lista agregada");
                $("#nombreListaTxt").val("");
            }
        }
        cargarListasOptionPanel();
        $.mobile.changePage('#pagina_listas');
    });

    function crearListasPreCargadas() {
        var mis_listas = {
            "Favoritos": {
                "id_peli1": {
                    "unit": 84,
                    "show_id": 60032563,
                    "show_title": "Kill Bill: Vol. 2",
                    "release_year": "2004",
                    "rating": "3.8",
                    "category": "Action & Adventure",
                    "show_cast": "Uma Thurman, David Carradine, Michael Madsen, Daryl Hannah, Gordon Liu, Michael Parks, Perla Haney-Jardine, Helen Kim, Claire Smithies, Clark Middleton",
                    "director": "Quentin Tarantino",
                    "summary": "The Bride has three left on her rampage list: Budd, Elle Driver and Bill himself. But when she arrives at Bill's house, she's in for a surprise.",
                    "poster": "http://netflixroulette.net/api/posters/60032563.jpg",
                    "mediatype": 0,
                    "runtime": "137 min"
                },
                "id_peli2": {
                    "unit": 84,
                    "show_id": 60032563,
                    "show_title": "Kill Bill: Vol. 2",
                    "release_year": "2004",
                    "rating": "3.8",
                    "category": "Action & Adventure",
                    "show_cast": "Uma Thurman, David Carradine, Michael Madsen, Daryl Hannah, Gordon Liu, Michael Parks, Perla Haney-Jardine, Helen Kim, Claire Smithies, Clark Middleton",
                    "director": "Quentin Tarantino",
                    "summary": "The Bride has three left on her rampage list: Budd, Elle Driver and Bill himself. But when she arrives at Bill's house, she's in for a surprise.",
                    "poster": "http://netflixroulette.net/api/posters/60032563.jpg",
                    "mediatype": 0,
                    "runtime": "137 min"
                }
            },
            "Drama": {
                "id_peli3": {
                    "unit": 84,
                    "show_id": 60032563,
                    "show_title": "Kill Bill: Vol. 2",
                    "release_year": "2004",
                    "rating": "3.8",
                    "category": "Action & Adventure",
                    "show_cast": "Uma Thurman, David Carradine, Michael Madsen, Daryl Hannah, Gordon Liu, Michael Parks, Perla Haney-Jardine, Helen Kim, Claire Smithies, Clark Middleton",
                    "director": "Quentin Tarantino",
                    "summary": "The Bride has three left on her rampage list: Budd, Elle Driver and Bill himself. But when she arrives at Bill's house, she's in for a surprise.",
                    "poster": "http://netflixroulette.net/api/posters/60032563.jpg",
                    "mediatype": 0,
                    "runtime": "137 min"
                }
            }
        };
        localStorage.setItem("mis_listas", JSON.stringify(mis_listas));
    }

    $("#nueva_lista_cancelar").click(function () {
        $("#nombreListaTxt").val("");
        $.mobile.changePage('#pagina_listas');
    });


    // cargar listas en option panel 
    var mis_listas = JSON.parse(localStorage.getItem("mis_listas"));

    function cargarListasOptionPanel() {
        mis_listas = JSON.parse(localStorage.getItem("mis_listas"));
        $("#listasUsuario").empty();
        $("#listasUsuario").append("<option value=" + " disabled selected>Seleccionar lista</option>");
        try {
            i = 0;
            $.each(mis_listas, function (key, value) {
                $("#listasUsuario").append("<option id='" + key + "' class='ui-field-contain'>" + key + "</option>");
            });
        } catch (err) {
            alert("No existen listas guardadas");
        }
        //$("#listasUsuario").listview('refresh');
    };

    // cargar listas -Favoritos- en option panel de la pelicula seleccionada
    function cargarListasOptionPanelDePelicula() {
        mis_listas = JSON.parse(localStorage.getItem("mis_listas"));
        $("#listasUsuarioEnPeli").empty();
        $("#listasUsuarioEnPeli").append("<option value=" + " disabled selected>Seleccionar lista</option>");
        try {
            i = 0;
            $.each(mis_listas, function (key, value) {
                $("#listasUsuarioEnPeli").append("<option id='" + key + "' class='ui-field-contain'>" + key + "</option>");
            });
        } catch (err) {
            alert("No existen listas guardadas");
        }
        //$("#listasUsuarioEnPeli").listview('refresh');
    };

    // lista la lista de pelis seleccionada en option panel
    $("#listasUsuario").on("click", "option", function () {
        var lista = $(this).text();
        $("#lista_peli_fav").empty();
        $.each(mis_listas, function (key, val) {
            if (lista == key) {
                $.each(val, function (key2, value) {
                    $("#lista_peli_fav").append("<li id='" + value.show_title + "' class='ui-btn ui-btn ui-li ui-li-has-alt ui-li-has-thumb'><img src='" + value.poster + "' class='ui-li-thumb ui-corner-bl' alt='" + value.show_title + "' /><h6 class='ui-li-heading'>" + value.show_title + "</h6><p class='ui-li-desc'>Año: " + value.release_year + ".  Rating: " + value.rating + ".  Genero: " + value.category + "</p><p class='ui-li-desc'>" + value.summary + "</p></li>");
                });
            }
        });
        $("#lista_peli_fav").listview('refresh');
    });

});
