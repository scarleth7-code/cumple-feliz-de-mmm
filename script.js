// =====================================
// CAMBIO DE PANTALLAS
// =====================================

const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(screenId);

    if (targetScreen) {
        targetScreen.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

// =====================================
// BOTONES DE NAVEGACIÓN
// =====================================

document.getElementById("openButton").addEventListener("click", () => {
    showScreen("introScreen");
});

document.getElementById("startButton").addEventListener("click", () => {
    showScreen("candleScreen");
    startCandles();
});

document.getElementById("continueButton").addEventListener("click", () => {
    showScreen("nextScreen");
});

document.getElementById("afterWishButton").addEventListener("click", () => {
    showScreen("transitionScreen");
});

// Después de enviar el deseo, aparece la carta
document.getElementById("letterButton").addEventListener("click", () => {
    showScreen("letterScreen");
});

// Desde la carta se pasa a la canción
document.getElementById("letterToSongButton").addEventListener("click", () => {
    showScreen("songScreen");
});

// Después de la canción aparecen las razones
document.getElementById("songButton").addEventListener("click", () => {
    showScreen("whySongScreen");
});

// =====================================
// INTERACCIÓN DE LAS 17 VELITAS
// =====================================

let candlesExtinguished = 0;
const totalCandles = 17;

const candleCounter = document.getElementById("candleCounter");
const progressBar = document.getElementById("progressBar");
const singleCandle = document.getElementById("singleCandle");
const candleMessage = document.getElementById("candleMessage");

function startCandles() {
    candlesExtinguished = 0;

    candleCounter.textContent = "0 de 17 velitas";
    progressBar.style.width = "0%";
    candleMessage.textContent = "¡Toca la velita!";

    singleCandle.classList.remove("extinguished");
    singleCandle.style.pointerEvents = "auto";
    singleCandle.setAttribute("aria-disabled", "false");
}

function extinguishCandle() {
    if (candlesExtinguished >= totalCandles) {
        return;
    }

    if (singleCandle.classList.contains("extinguished")) {
        return;
    }

    singleCandle.classList.add("extinguished");
    candlesExtinguished++;

    candleCounter.textContent =
        `${candlesExtinguished} de ${totalCandles} velitas`;

    const progress = (candlesExtinguished / totalCandles) * 100;
    progressBar.style.width = `${progress}%`;

    if (candlesExtinguished < totalCandles) {
        candleMessage.textContent = "¡Una menos! Sigue así...";

        setTimeout(() => {
            singleCandle.classList.remove("extinguished");
        }, 550);

    } else {
        candleMessage.textContent = "¡Las 17 velitas están apagadas!";

        singleCandle.style.pointerEvents = "none";
        singleCandle.setAttribute("aria-disabled", "true");

        setTimeout(() => {
            showBirthdayCake();
        }, 1100);
    }
}

singleCandle.addEventListener("click", extinguishCandle);

singleCandle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        extinguishCandle();
    }
});

// =====================================
// APARICIÓN DE LA TORTA CON 17 VELITAS
// =====================================

function showBirthdayCake() {
    showScreen("finalScreen");

    const cakeCandles = document.getElementById("cakeCandles");
    cakeCandles.innerHTML = "";

    const candleCount = 17;
    const radiusX = 88;
    const radiusY = 34;
    const centerX = 50;
    const centerY = 18;

    for (let i = 0; i < candleCount; i++) {
        const candle = document.createElement("div");
        candle.classList.add("cake-candle");

        const angle = (Math.PI * 2 * i) / candleCount;

        const x = centerX + Math.cos(angle) * radiusX / 2.45;
        const y = centerY + Math.sin(angle) * radiusY / 2.45;

        candle.style.left = `${x}%`;
        candle.style.bottom = `${y + 125}px`;
        candle.style.animationDelay = `${i * 0.07}s`;

        cakeCandles.appendChild(candle);
    }
}

// =====================================
// ENVÍO DEL DESEO
// =====================================

const wishForm = document.getElementById("wishForm");
const wishMessage = document.getElementById("wishMessage");
const wishButton = document.getElementById("wishButton");
const wishFeedback = document.getElementById("wishFeedback");
const afterWishButton = document.getElementById("afterWishButton");

wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = wishMessage.value.trim();

    if (!message) {
        wishFeedback.textContent = "Primero escribe tu deseo.";
        return;
    }

    wishButton.disabled = true;
    wishButton.textContent = "Enviando...";
    wishFeedback.textContent = "";

    try {
        const response = await fetch(
            "https://formspree.io/f/xwlljpyw",
            {
                method: "POST",
                body: new FormData(wishForm),
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo enviar el deseo.");
        }

        wishForm.hidden = true;

        wishFeedback.textContent =
            "¡Tu deseo fue enviado correctamente!";

        afterWishButton.hidden = false;

    } catch (error) {
        wishFeedback.textContent =
            "No se pudo enviar. Comprueba tu conexión e inténtalo otra vez.";

        wishButton.disabled = false;
        wishButton.textContent = "Enviar mi deseo";
    }
});