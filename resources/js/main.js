document.addEventListener("DOMContentLoaded", function () {
	const horaInput = document.getElementById("horaInput");
	const btnSetTime = document.getElementById("btnSetTime");
	const btnReset = document.getElementById("btnReset");
	const txtTempoRestante = document.getElementById("txtTempoRestante");

	let contadorInterval;

	horaInput.addEventListener("input", function () {
		this.style.color = "black";
		btnSetTime.disabled = true;

		if (horaInput.value.length == 5) {
			if (!isHoraValida(horaInput.value)) {
				btnSetTime.disabled = true;
			} else {
				this.style.color = "black";
				sleep(900).then(() => {
					btnSetTime.disabled = false;
				});
			}
		}
	});

	horaInput.addEventListener("keypress", function (event) {
		const key = event.key;

		// Permitir apenas números (0-9)
		if (!/[0-9]/.test(key)) {
			event.preventDefault();
		}
	});

	horaInput.addEventListener("blur", function () {
		if (!isHoraValida(this.value)) {
			this.style.color = "red";
		} else {
			this.style.color = "black";
		}
	});

	btnSetTime.addEventListener("click", function (evt) {
		const horaAtual = moment().format("HH:mm:ss");
		const horaFinal = horaInput.value + ":00";

		if (isHoraFinalMenor(horaAtual, horaFinal)) {
			alert("A hora final é menor que a atual.");
			return;
		}

		horaInput.disabled = true;
		btnSetTime.disabled = true;

		btnReset.disabled = false;

		// Iniciar o contador e armazenar o intervalo
		contadorInterval = iniciarContador(horaFinal);
	});

	btnReset.addEventListener("click", function (evt) {
		horaInput.value = "";
		horaInput.disabled = false;
		btnSetTime.disabled = true;
		btnReset.disabled = true;
		txtTempoRestante.value = "";
		clearInterval(contadorInterval);
	});

	// Máscara para HH:mm
	horaInput.addEventListener("input", function () {
		const inputValue = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
		if (inputValue.length > 2) {
			this.value = inputValue.substring(0, 2) + ":" + inputValue.substring(2);
		}
	});

	obterHoraAtual();
});

const obterHoraAtual = function () {
	const txtHoraAtual = document.querySelector("#txtHoraAtual");

	setInterval(() => {
		txtHoraAtual.setAttribute("value", moment().format("HH:mm:ss"));
	}, 1000);
};

const isHoraValida = function (input) {
	// Verificar se a entrada segue o formato HH:MM e se as horas e minutos são válidos
	const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
	return regex.test(input);
};

const sleep = function (ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const isHoraFinalMenor = function (horaAtual, horaDestino) {
	const horaReferencia = new Date(`1970-01-01T${horaAtual}`);
	const horaFinal = new Date(`1970-01-01T${horaDestino}`);
	return horaFinal < horaReferencia;
};

const iniciarContador = function (horaFinal) {
	const tempoRestante = document.getElementById("txtTempoRestante");

	// Retorna o ID do intervalo para que possa ser limpo posteriormente.
	return setInterval(() => {
		const agora = new Date();
		const horaFinalObj = new Date(agora.toDateString() + " " + horaFinal);

		const diferencaMilisegundos = horaFinalObj - agora;

		let diferencaSegundos = diferencaMilisegundos / 1000;
		if (diferencaSegundos <= 0) {
			diferencaSegundos = 0;
		}

		tempoRestante.value = diferencaSegundos.toFixed(0);
	}, 1000);
};

if ("serviceWorker" in navigator) {
	window.addEventListener("load", function () {
		navigator.serviceWorker
			.register("/serviceWorker.js")
			.then((res) => console.log("service worker registered"))
			.catch((err) => console.log("service worker not registered", err));
	});
}
