'use strict'

// VARIABLES
// Extraigo el número de lo que contenga la variable --nav-height (porque tendrá alguna unidad) y lo convierto en Number.
const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height").match(/\d+/));

/// Posiciones en el eje vertical de las secciones de la página
const posAbout 	  = ObtenerPosicionY(document.getElementById("welcome-section"));
const posProjects = ObtenerPosicionY(document.getElementById("projects"));
const posContacto = ObtenerPosicionY(document.getElementById("contacto"));

// ¿La barra del navegador tiene que ser opaca o transparente?
var navOpaco = false;

// ¿He hecho click recientemente en un botón del navegador? Esta variable se activa al hacer click y se desactiva al llegar a la sección del botón presionado
var navLinkClick = false;

var welcomeOpacityElements = document.getElementById("about-container").querySelectorAll(".opacidad-variable");
// Punto de inicio de ganancia de transparencia (opacidad 100%)
var welcomeOpacityStart = window.innerHeight * 0.15;
// Punto final de ganancia de transparencia (opacidad 0%)
var welcomeOpacityEnd = window.innerHeight * 0.6;



// LISTENERS
document.getElementById("nav-about").addEventListener("click", function(){ AdministrarNavLink('nav-about') }, false);
document.getElementById("nav-proyectos").addEventListener("click", function(){ AdministrarNavLink('nav-proyectos') }, false);
document.getElementById("nav-contacto").addEventListener("click", function(){ AdministrarNavLink('nav-contacto') }, false);
window.addEventListener("scroll", function() {
	DeterminarNavLink();
	
	if (!navOpaco) {
		if (window.pageYOffset > window.innerHeight - navHeight) {
			navOpaco = true;
			MostrarNavOpaco();
		} else {
			CalcularOpacidadWelcomeSection();
		}
	} else {
		if (window.pageYOffset <= window.innerHeight - navHeight) {
			navOpaco = false;
			MostrarNavTransparente();
		}
	}
}, false);



// FUNCIONES
/**
 * ObtenerPosicionY()
 * Obtiene la posición en la página, el eje Y, de un elemento.
 * @param elemento:object
 */
function ObtenerPosicionY(elemento) {
	//! Control de errores
	if (!elemento || typeof elemento !== 'object') {
		console.error("Argumento del parámetro de ObtenerPosicionY(elemento) es incorrecto.");
		return;
	} //! Fin control de errores
	
	var posicionY = 0;

	while(elemento)	{
		// Acumulo la distancia respecto al top del padre, restándole lo que haya scrolleado y sumando el borde del padre
		posicionY += (elemento.offsetTop - elemento.scrollTop + elemento.clientTop);
		elemento = elemento.offsetParent;
	}
	return posicionY;
}


/**
 * OnScrollEnd() es un evento personalizado que determina si el usuario ha terminado un scroll.
 * @param callback:function
 */
function OnScrollEnd (callback) {
	//! Control de errores
	if (!callback || typeof callback !== 'function') {
		console.error("Argumento del parámetro de OnScrollEnd(callback) es incorrecto.");
		return;
	} //! Fin control de errores

	// En esta variable almaceno el timeout cada vez que hay un evento de scroll
	var isScrolling;

	window.addEventListener('scroll', function (event) {
		// En cada evento de scroll, presupongo que el usuario no ha parado de scrollear, así que borro el timeout para evitar que se llame al callback.
		window.clearTimeout(isScrolling);

		// Almaceno el timeout para poder resetearlo en caso de que vuelva a haber un evento de scroll antes de que pase el tiempo del timeout.
		isScrolling = setTimeout(function() {			
			callback();
		}, 100);
	}, false);
}


/**
 * MostrarNavOpaco()
 * Activa la transición de la barra del navegador para que se vuelva opaco.
 */
function MostrarNavOpaco() {

	var navBtns = document.getElementsByClassName("nav-link");

	// Logo
	document.getElementById("logo-blanco").classList.add("hidden");
	document.getElementById("logo-gris").classList.remove("hidden");
	
	// Fondo
	document.getElementById("master-header").classList.add("navbar-opaque");
	
	// Fuentes
	for (var i = 0 ; i < navBtns.length ; i++) {
		navBtns[i].classList.add("navbar-opaque");
	}
	document.getElementById("logo-title").classList.add("navbar-opaque");	
	document.getElementById("logo-subtitle").classList.add("navbar-opaque");
}


/**
 * MostrarNavTransparente()
 * Activa la transición de la barra del navegador para que se vuelva transparente.
 */
function MostrarNavTransparente() {

	var navBtns = document.getElementsByClassName("nav-link");

	// Logo
	document.getElementById("logo-blanco").classList.remove("hidden");
	document.getElementById("logo-gris").classList.add("hidden");
	
	// Fondo
	document.getElementById("master-header").classList.remove("navbar-opaque");
	
	// Fuentes
	for (var i = 0 ; i < navBtns.length ; i++) {
		navBtns[i].classList.remove("navbar-opaque");
	}
	document.getElementById("logo-title").classList.remove("navbar-opaque");
	document.getElementById("logo-subtitle").classList.remove("navbar-opaque");
}


/**
 * CalcularOpacidadWelcomeSection()
 * Calcula la opacidad de los elementos de la sección de bienvenida a medida que se hace scroll.
 */
function CalcularOpacidadWelcomeSection() {
	
	// Porcentaje del recorrido entre start y end en función del scroll vertical interpolando linearmente
	var linearPercentage = (window.pageYOffset - welcomeOpacityStart) / welcomeOpacityEnd;
	// Porcentaje destinado a interpolar con ease-out
	var easeOutPercentage = linearPercentage*(2-linearPercentage);
	// Me aseguro de que la opacidad se mantenga entre 0 y 1
	var opacidad = Math.max(0, Math.min(1, 1 - easeOutPercentage));

	for (var i = 0 ; i < welcomeOpacityElements.length ; i++) {		
		welcomeOpacityElements[i].style.opacity = opacidad;
	}
}


/**
 * DeterminarNavLink()
 * Al scrollear, calcula en qué zona de la página está el usuario y ordena activar el
 * botón que corresponda en el navegador en función del resultado.
 */
function DeterminarNavLink() {
	// Sólo quiero cambiar el botón activo por scroll si el scroll no es debido a que el usuario ha pulsado un botón de la barra de navegación
	if (!navLinkClick) {
		var navLinkId = ""; // Id del elemento que contiene el botón que habrá que activar en la función ActivarNavLink()

		/* ¿Estoy en el fondo de la página? innerHeight es el alto de la pantalla, scrollY es lo que he scrolleado en vertical y la suma de ambos será igual a body.offsetHeight, que es el alto de la página
			 * Esto sirve para detectar la última sección en relaciones de aspecto en las que no se puede scrollear suficiente como para que el scrollY sea mayor que la posición del ancla
			 */
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - (navHeight - 5)) { navLinkId = "nav-contacto"; }
		else if (window.scrollY < posProjects - (navHeight - 5)) { navLinkId = "nav-about"; 	}	// Si window.scrollY es menor que la posición de la siguiente sección, aún no he llegado a ella, por lo que tengo que activar el botón de la anterior
		else if (window.scrollY < posContacto - (navHeight - 5)) { navLinkId = "nav-proyectos"; }	// El resto añade un margen de anticipación como margen de error y para comodidad del usuario
		else							   			 			 { navLinkId = "nav-contacto";  }	// Comprobación corriente de la última sección para relaciones de aspecto en las que sí se puede scrollear suficiente como para detectarla

		ActivarNavLink(navLinkId);
	}
}


/**
 * AdministrarNavLink()
 * Ordena activar el botón presionado y bloquea la gestión de botón activo por scroll
 * hasta que el scroll termine.
 * @param navLinkId:string
 */
function AdministrarNavLink(navLinkId) {
	//! Control de errores
	if (!navLinkId || typeof navLinkId !== 'string') {
		console.error("Argumento del parámetro de AdministrarNavLink(navLinkId) es incorrecto.");
		return;
	} //! Fin control de errores

	navLinkClick = true;
	ActivarNavLink(navLinkId);
	OnScrollEnd(function() { navLinkClick = false; });
}

/**
 * ActivarNavLink()
 * Ejecuta la activación visual del botón del navegador indicado y desactiva todos los demás.
 * @param navLinkId:string
 */
function ActivarNavLink(navLinkId) {
	//! Control de errores
	if (!navLinkId || typeof navLinkId !== 'string') {
		console.error("Argumento del parámetro de ActivarNavLink(navLinkId) es incorrecto.");
		return;
	} //! Fin control de errores

	var navlinks = document.getElementsByClassName("nav-link");

	for (var i = 0 ; i < navlinks.length ; i++)	{
		navlinks[i].classList.remove("active");
	}
	document.getElementById(navLinkId).classList.add("active");
}
