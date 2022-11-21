import "./reset.css";
import "./style.css";

const $OPEN_MENU_BUTTON = document.getElementById("icon_menu");
const $CLOSE_MENU = document.getElementById("close_menu");
const $MENU = document.getElementById("app_menu");
const $NAVIGATION_LINKS = document.querySelectorAll("#navlink");
const $PAGES = document.querySelectorAll("#page");
const $GENERATE_SIREN_FORM = document.getElementById("generate_siren_form");
const $GENERATE_SIREN_FORM_ERROR = document.getElementById("generate_siren_form_error");
const $GENERATE_SIREN_BUTTON = document.getElementById("generate_siren_button");
const $VERIFY_SIREN_FORM = document.getElementById("verify_siren_form");
const $CHECK_SIREN_MESSAGE = document.getElementById("verify_siren_message");
const $DISPLAY_BASE_SIREN = document.getElementById("display_base_siren");


const $DISPLAY_SIREN = document.getElementById("display_siren");

const ERROR_MESSAGES = {
	Algo_luhn: " The number must follow the Luhn formula",
	input_lastNumber_length: "Please fill in the first 8 digits",
	type_input_length: "need to be 9 numbers and folow the number must follow the Luhn formula",
	type: "The number must be a number",
	length: "The number must be 9 digits",
	
};

function displayFormError(element, error) {
	element.style.display = "block";
	element.textContent = ERROR_MESSAGES[error];
}

function navigate(page) {
	[...$PAGES].forEach(($element) =>
		$element.dataset.page === page
			? ($element.style.display = "flex")
			: ($element.style.display = "none")
	);
	if (window.screen.width <= 780) {
		$MENU.classList.toggle("active");
	}
}

[...$NAVIGATION_LINKS].forEach(($element) =>
	$element.addEventListener("click", () => navigate($element.dataset.link))
);

$CLOSE_MENU.addEventListener("click", () => {
	$MENU.classList.toggle("active");
});
$OPEN_MENU_BUTTON.addEventListener("click", () => {
	$MENU.classList.toggle("active");
});

function verifySiren(siren) {
	let error = null;
	if (siren.length != 9 || isNaN(siren))
		isNaN(siren != 9 && siren.length)
			? (error = "type_input_length")
			: siren.length != 9
			? (error = "length")
			: (error = "type");
	else {
		let sum = 0;
		let tmp;
		for (let i = 0; i < siren.length; i++) {
			if (i % 2 == 1) {
				tmp = siren.charAt(i) * 2;
				if (tmp > 9) tmp -= 9;
			} else tmp = siren.charAt(i);
			sum += parseInt(tmp);
		}
		if (sum % 10 != 0) error = "Algo_luhn";
	}
	return {
		error,
		isValid: !error,
	};
}

function getRandomSiren(min, max) {
	let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
	randomNumber = randomNumber / 4294967296;
	return Math.floor(randomNumber * (max - min + 1)) + min;
}

function generateSiren(baseSiren = null) {
	let siren = baseSiren
		? baseSiren + String(getRandomSiren(1, 9))
		: String(getRandomSiren(100000000, 999999999));
	if (verifySiren(siren).isValid) return siren;
	return generateSiren(baseSiren);
}

function generateSirenLastNumber(baseSiren) {
	let error = null;
	let siren;
	if (baseSiren.length !== 8) error = "input_lastNumber_length";
	else siren = generateSiren(baseSiren);
	return { siren, error };
}

$GENERATE_SIREN_BUTTON.addEventListener("click", () => {
	const siren = generateSiren();
	$DISPLAY_SIREN.innerHTML = `<p>your siren number is the : ${siren}</p>`;
});
$GENERATE_SIREN_FORM.addEventListener("submit", (e) => {
	e.preventDefault();
	const { siren, error } = generateSirenLastNumber(
		e.target.elements["baseSiren"].value
	);
	if (error) {
		displayFormError($GENERATE_SIREN_FORM_ERROR, error);
		return;
	}
	$DISPLAY_BASE_SIREN.innerHTML = `<p>your siren number is the : ${siren}</p>`;
});
$VERIFY_SIREN_FORM.addEventListener("submit", (e) => {
	e.preventDefault();
	const { isValid, error } = verifySiren(e.target.elements["siren"].value);
	$CHECK_SIREN_MESSAGE.innerHTML = `<p>${
		isValid
			? " This siren number is valid  !"
			: " This siren number is invalid : " + ERROR_MESSAGES[error]
	}</p>`;
	$CHECK_SIREN_MESSAGE.style.color = isValid ? "#32936f" : "#db2b39";
});

