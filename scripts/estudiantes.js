const deleteBtn = document.getElementById("elim-btn");
const addBtn = document.getElementById("agreg-btn");

const overlay = document.getElementById("overlay");
const saveBtn = document.getElementById("save-student");
const cancelBtn = document.getElementById("cancel-student");

const inputName = document.getElementById("student-name");

const cardsGrid = document.querySelector(".cards-grid");

let selectedCard = null;

deleteBtn.disabled = true;

const students = [
    "Estudiante 1",
    "Estudiante 2",
    "Estudiante 3",
    "Estudiante 4",
    "Estudiante 5"
];

function attachCardEvents(card){

    card.addEventListener("click", () => {

        if(selectedCard === card){

            card.querySelector(".select-circle")
                .style.backgroundColor = "transparent";

            selectedCard = null;

            deleteBtn.disabled = true;

            return;
        }

        if(selectedCard){

            selectedCard.querySelector(".select-circle")
                .style.backgroundColor = "transparent";
        }

        selectedCard = card;

        card.querySelector(".select-circle")
            .style.backgroundColor = "rgba(255,255,255,.8)";

        deleteBtn.disabled = false;
    });
}

function createCard(studentName){

    const article = document.createElement("article");

    article.classList.add("card");

    article.innerHTML = `
        <span>${studentName}</span>
        <div class="select-circle"></div>
    `;

    cardsGrid.appendChild(article);

    attachCardEvents(article);
}

// Cargar estudiantes iniciales
students.forEach(student => {
    createCard(student);
});

deleteBtn.addEventListener("click", () => {

    if(!selectedCard) return;

    const studentName =
        selectedCard.querySelector("span").textContent;

    const confirmar = confirm(
        `¿Está seguro que desea eliminar al estudiante "${studentName}"?`
    );

    if(!confirmar) return;

    const index = students.indexOf(studentName);

    if(index !== -1){
        students.splice(index, 1);
    }

    selectedCard.remove();

    alert(`El estudiante "${studentName}" fue eliminado.`);

    selectedCard = null;

    deleteBtn.disabled = true;

    console.log(students);
});

addBtn.addEventListener("click", () => {

    overlay.classList.remove("hidden");

    inputName.value = "";

    inputName.focus();
});

cancelBtn.addEventListener("click", () => {

    overlay.classList.add("hidden");
});

saveBtn.addEventListener("click", () => {

    const name = inputName.value.trim();

    if(name === ""){

        alert("Debe ingresar un nombre.");

        return;
    }

    const validName = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if(!validName.test(name)){

        alert("El nombre no puede contener números ni caracteres inválidos.");

        return;
    }

    students.push(name);

    createCard(name);

    overlay.classList.add("hidden");

    alert(`El estudiante "${name}" fue agregado correctamente.`);

    console.log(students);
});