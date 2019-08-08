(function(){
'use strict'

//* VARIABLES
var welcomeOpacityElements = document.getElementById("about-container").querySelectorAll(".opacidad-variable");
// Punto de inicio de ganancia de transparencia (opacidad 100%)
var welcomeOpacityStart = window.innerHeight * 0.15;
// Punto final de ganancia de transparencia (opacidad 0%)
var welcomeOpacityEnd = window.innerHeight * 0.6;

//* LISTENERS
window.addEventListener("scroll", function() {
	
	if (welcomeOpacityStart <= window.pageYOffset <= welcomeOpacityEnd) {
		CalcularOpacidadWelcomeSection();
	}
}, false);



//* FUNCIONES
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
})();