// =========================
// USUARIOS DEL SISTEMA
// =========================

const usuarios = [
    "212026",
    "Juan Pérez",
    "María Gómez",
    "Pedro Rodríguez"
];

// =========================
// VARIABLE GLOBAL
// =========================

let isAdmin = false;

// =========================
// ELEMENTOS DEL DOM
// =========================

const input = document.querySelector(".access-input");
const btn = document.querySelector(".login-btn");
const errorBox = document.querySelector(".error-message");

// =========================
// FUNCIONES
// =========================

function mostrarError(mensaje) {
    errorBox.textContent = mensaje;
    errorBox.style.display = "block";
}

function ocultarError() {
    errorBox.style.display = "none";
}

function activarLoader() {

    btn.disabled = true;

    btn.innerHTML = `
        <span class="loader"></span>
    `;

    if (!document.getElementById("loader-style")) {

        const style = document.createElement("style");

        style.id = "loader-style";

        style.textContent = `
            .loader{
                width:20px;
                height:20px;
                border:3px solid rgba(255,255,255,.3);
                border-top:3px solid white;
                border-radius:50%;
                display:inline-block;
                animation:girar .8s linear infinite;
            }

            @keyframes girar{
                from{
                    transform:rotate(0deg);
                }
                to{
                    transform:rotate(360deg);
                }
            }
        `;

        document.head.appendChild(style);
    }
}

function desactivarLoader() {
    btn.disabled = false;
    btn.textContent = "Ingresar";
}

function normalizar(texto) {
    return texto.trim().toLowerCase();
}

// =========================
// LOGIN
// =========================

btn.addEventListener("click", login);

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        login();
    }
});

function login() {

    ocultarError();

    const nombreIngresado = normalizar(input.value);

    if (!nombreIngresado) {
        mostrarError("Ingrese un nombre.");
        return;
    }

    activarLoader();

    setTimeout(() => {

        const usuarioEncontrado = usuarios.find(
            usuario => normalizar(usuario) === nombreIngresado
        );

        if (!usuarioEncontrado) {

            desactivarLoader();

            mostrarError("Usuario no encontrado.");

            return;
        }

        // Determinar si es administrador
        isAdmin = nombreIngresado === "admin";

        console.log("Login correcto");
        console.log("isAdmin:", isAdmin);

        desactivarLoader();

        // Redirección opcional
        // window.location.href = "inicio.html";

    }, 1000);
}