
// Extraigo el número de lo que contenga la variable --nav-height (porque tendrá alguna unidad) y lo convierto en Number.
const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height").match(/\d+/));

/// Posiciones en el eje vertical de las secciones de la página
const posAbout 		= ObtenerPosicionY(document.getElementById("welcome-section"));
const posProjects = ObtenerPosicionY(document.getElementById("projects"));
const posContacto = ObtenerPosicionY(document.getElementById("contacto"));

// ¿La barra del navegador tiene que ser opaca o transparente?
var navOpaco = false;

// ¿He hecho click recientemente en un botón del navegador? Esta variable se activa al hacer click y se desactiva al llegar a la sección del botón presionado
var navLinkClick = false;




function ObtenerPosicionY(elemento)
{	
	console.log(window.innerWidth);
	var posicionY = 0;

	while(elemento)
	{
		// Acumulo la distancia respecto al top del padre, restándole lo que haya scrolleado y sumando el borde del padre
		posicionY += (elemento.offsetTop - elemento.scrollTop + elemento.clientTop);
		elemento = elemento.offsetParent;
	}
	return posicionY;
}


/**
	 * OnScrollEnd() determina si el usuario está haciendo scroll.
	 * Cuando el scroll pare, llamará a un callback.
	 */
function OnScrollEnd (callback)
{
	// Para asegurarme de que HAY callback y de que es una función
	if (!callback || typeof callback !== 'function') { return; }

	// En esta variable almaceno el timeout cada vez que hay un evento de scroll
	var isScrolling;

	window.addEventListener('scroll', function (event)
													{
		// En cada evento de scroll, presupongo que el usuario no ha parado de scrollear, así que borro el timeout para evitar que se llame al callback
		window.clearTimeout(isScrolling);

		// Almaceno el timeout para poder resetearlo en caso de que vuelva a haber un evento de scroll antes de que pase el tiempo del timeout
		isScrolling = setTimeout(function()
														 {
			callback();
		}, 66);
	}, false);
}


document.getElementById("nav-about").addEventListener("click", function(){ AdministrarNavLink('nav-about') }, false);
document.getElementById("nav-proyectos").addEventListener("click", function(){ AdministrarNavLink('nav-proyectos') }, false);
document.getElementById("nav-contacto").addEventListener("click", function(){ AdministrarNavLink('nav-contacto') }, false);


window.addEventListener("scroll", function()
{
	DeterminarNavLink();
	
	if (!navOpaco)
	{
		if (window.pageYOffset > window.innerHeight - navHeight)
		{
			navOpaco = true;
			MostrarNavOpaco();
		}
		else
		{
			CalcularOpacidadWelcomeSection();
		}
	}
	else
	{
		if (window.pageYOffset <= window.innerHeight - navHeight)
		{
			navOpaco = false;
			MostrarNavTransparente();
		}
	}
}, false);


function MostrarNavOpaco()
{
	// Logo
	document.getElementById("logo-blanco").style.display = "none";
	document.getElementById("logo-gris").style.display = "block";
	
	// Fondo
	document.getElementById("master-header").style.background = "var(--head-bg-color, white)";
	
	// Fuentes
	var navBtns = document.getElementsByClassName("nav-link");
	for (var i = 0 ; i < navBtns.length ; i++)
	{
		navBtns[i].style.color = "var(--font-color, black)";
	}
	document.getElementById("logo-title").style.color = "var(--font-color, black)";	
	document.getElementById("logo-subtitle").style.color = "var(--theme-color, MediumVioletRed)";
}


function MostrarNavTransparente()
{	
	// Logo
	document.getElementById("logo-blanco").style.display = "block";
	document.getElementById("logo-gris").style.display = "none";
	
	// Fondo
	document.getElementById("master-header").style.background = "rgba(0,0,0,0.01)";
	
	// Fuentes
	var navBtns = document.getElementsByClassName("nav-link");
	for (var i = 0 ; i < navBtns.length ; i++)
	{
		navBtns[i].style.color = "white";
	}
	document.getElementById("logo-title").style.color = "white";
	document.getElementById("logo-subtitle").style.color = "hsl(342, 75%, 50%)";
}


function CalcularOpacidadWelcomeSection()
{
	var elementos = document.getElementById("about-container").querySelectorAll(".opacidad-variable");	
	for (var i = 0 ; i < elementos.length ; i++)
	{
		// Hallo la opacidad en función de cuánto he scrolleado, asegurándome de que se mantenga entre 0 y 1
		var opacidad = Math.max(0, Math.min(1, 1 - (window.pageYOffset / (window.innerHeight / 2))));
		elementos[i].style.opacity = opacidad;
	}
}


/**
	 * DeterminarNavLink() calcula en qué zona de la página está el usuario y
	 * llama a la función ActivarNavLink(), pasándole esa información como parámetro.
	 */
function DeterminarNavLink()
{
	// Sólo quiero cambiar el botón activo por scroll si el scroll no es debido a que el usuario ha pulsado un botón de la barra de navegación
	if (!navLinkClick)
	{
		var navLinkId = ""; // Id del elemento que contiene el botón que habrá que activar en la función ActivarNavLink()

		/* ¿Estoy en el fondo de la página? innerHeight es el alto de la pantalla, scrollY es lo que he scrolleado en vertical y la suma de ambos será igual a body.offsetHeight, que es el alto de la página
			 * Esto sirve para detectar la última sección en relaciones de aspecto en las que no se puede scrollear suficiente como para que el scrollY sea mayor que la posición del ancla
			 */
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - (navHeight - 5)) { navLinkId = "nav-contacto"; }
		else if (window.scrollY < posProjects - (navHeight - 5)) { navLinkId = "nav-about"; 		}	// Si window.scrollY es menor que la posición de la siguiente sección, aún no he llegado a ella, por lo que tengo que activar el botón de la anterior
		else if (window.scrollY < posContacto - (navHeight - 5)) { navLinkId = "nav-proyectos"; }	// El resto añade un margen de anticipación como margen de error y para comodidad del usuario
		else																			   			 			 { navLinkId = "nav-contacto";  }	// Comprobación corriente de la última sección para relaciones de aspecto en las que sí se puede scrollear suficiente como para detectarla

		ActivarNavLink(navLinkId);
	}
}


function AdministrarNavLink(navLinkId)
{
	navLinkClick = true;
	ActivarNavLink(navLinkId);
	OnScrollEnd(function() { navLinkClick = false; });
}


function ActivarNavLink(navLinkId)
{
	var navlinks = document.getElementsByClassName("nav-link");

	for (i = 0 ; i < navlinks.length ; i++)
	{
		navlinks[i].classList.remove("active");
	}

	document.getElementById(navLinkId).classList.add("active");
}
