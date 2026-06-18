/*-------- Clase de Videos --------*/
class Video {
  #id;
  #user;
  #description;
  #videoUrl;
  #liked;
  #likes;
  #comments;

  constructor(id, user, description, videoUrl, liked = false, likes = 0, comments = []) {
    this.#id = id;
    this.#user = user;
    this.#description = description;
    this.#videoUrl = videoUrl;
    this.#liked = liked;
    this.#likes = likes;
    this.#comments = comments;
  }

  get id() {
    return this.#id;
  }

  get user() {
    return this.#user;
  }

  get description() {
    return this.#description;
  }

  get videoUrl() {
    return this.#videoUrl;
  }

  get liked() {
    return this.#liked;
  }

  set liked(value) {
    this.#liked = value;
  }

  get likes() {
    return this.#likes;
  }

  set likes(value) {
    this.#likes = value;
  }

  get comments() {
    return this.#comments;
  }

  addComment(user, text) {
    this.#comments.push({ user, text });
  }

  addLike() {
    if (!this.#liked) {
      this.#liked = true;
      this.#likes++;
    }
  }
}

const videos = [

  new Video(
    1,
    "@lukasrangel",
    "Datos interesantes sobre tu huella digital 😮",
    "Videos/Huella Digital.mp4",
    false,
    1200,
    [
      {
        user: "Lucas Rangel",
        text: "Muy buen dato 😮"
      }
    ]
  ),

  new Video(
    2,
    "@curiosidades123",
    "¿Tus datos siempre están protegidos?",
    "Videos/Video 2.mp4",
    false,
    860,
    []
  ),

  new Video(
    3,
    "@elcuriotok2",
    "¿Qué son los datos digitales?",
    "Videos/Datos.mp4",
    false,
    560,
    [
      {
        user: "Diana Leuchuk",
        text: "😮😮😮"
      },
      {
        user: "Lucas Rangel",
        text: "🤔🤔🤔"
      }
    ]
  ),

  new Video(
    4,
    "@elcentrodeldato",
    "Organización de la información",
    "Videos/Organización.mp4",
    false,
    2004,
    [
      {
        user: "Buzzo Yhadhi",
        text: "No entendí bien esto..."
      }
    ]
  )

];

const videoFeed = document.getElementById("videoFeed");
const commentsPanel = document.getElementById("commentsPanel");
const commentsList = document.getElementById("commentsList");

let currentComments = [];
const allVideos = [];

/*-------- Funcionalidades Generales --------*/
//#region 
videos.forEach((videoData)=>{

  const card = document.createElement("div");
  card.className = "video-card";

  card.innerHTML = `
    <div class="phone-frame">

    <video playsinline preload="metadata">
      <source src="${videoData.videoUrl}" type="video/mp4">
    </video>

    <div class="overlay">
      <h2>${videoData.user}</h2>
      <p>${videoData.description}</p>
    </div>

    <div class="action-mute-btn">
      <img src="Elementos Visuales/SinSonido.png" class="mute-icon">
    </div>

  <div class="actions">

      <div class="action-btn locked likeBtn">
        🔒
        <span class="timer">...</span>
      </div>

      <div class="action-btn commentBtn">
        💬
        <span>Comentarios</span>
      </div>

    </div>
  `;

  const video = card.querySelector("video");
  allVideos.push(video);
  const likeBtn = card.querySelector(".likeBtn");
  const commentBtn = card.querySelector(".commentBtn");
  const timer = card.querySelector(".timer");
  const pauseIcon = document.createElement('div');

    pauseIcon.className = 'pause-icon';
    pauseIcon.innerHTML = '▶';

    card.appendChild(pauseIcon);

  let unlocked = false;
  let manuallyPaused = false;
  let scrolling = false;
  let resetTimeout;
  let muted = true;
  video.muted = true;

/*------BOTÓN DE MUTE--------*/
const muteBtn = card.querySelector(".action-mute-btn");
const muteIcon = card.querySelector(".mute-icon");
muteBtn.addEventListener("dblclick",(e)=>{

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

});

muteBtn.addEventListener("click",(e)=>{

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  muted = !muted;

  allVideos.forEach(v => {
    v.muted = muted;
  });

  document.querySelectorAll(".mute-icon").forEach(icon => {

    icon.src = muted
      ? "Elementos Visuales/SinSonido.png"
      : "Elementos Visuales/ConSonido.png";

  });

  muteBtn.classList.add("active");

  setTimeout(()=>{

    muteBtn.classList.remove("active");

  },250);

});

  const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

      if(entry.isIntersecting){

        clearTimeout(resetTimeout);

        if(!manuallyPaused){
            video.play().catch(()=>{});
        }

        }else{

        video.pause();

        resetTimeout = setTimeout(()=>{
          video.currentTime = 0;
        },10000);

      }

    });

  },{
    threshold:.7
  });

  observer.observe(card);

  card.addEventListener("wheel",(e)=>{

    e.preventDefault();

    if(scrolling) return;

    scrolling = true;

    const next = card.nextElementSibling;
    const prev = card.previousElementSibling;

    if(e.deltaY > 0 && next){

      next.scrollIntoView({
        behavior:"smooth"
      });

    }

    if(e.deltaY < 0 && prev){

      prev.scrollIntoView({
        behavior:"smooth"
      });

    }

    setTimeout(()=>{
      scrolling = false;
    },500);

  },{ passive:false });

  video.addEventListener("loadedmetadata",()=>{

    timer.innerText = `${Math.ceil(video.duration)}s`;

  });

  video.addEventListener("timeupdate",()=>{

    if(unlocked) return;

    const remaining = Math.max(
      0,
      Math.ceil(video.duration - video.currentTime)
    );

    timer.innerText = `${remaining}s`;

    if(video.currentTime >= video.duration - .3){

      unlocked = true;

      likeBtn.classList.remove("locked");

      likeBtn.innerHTML = `
        <img 
          src="${
            videoData.liked
            ? 'Elementos Visuales/corazon2.png'
            : 'Elementos Visuales/corazon1.png'
          }"
          class="heart-icon"
        >
        <span>${videoData.likes}</span>
      `;

    }

  });

  video.addEventListener("ended",()=>{

    video.currentTime = 0;

    video.play().catch(()=>{});

  });

  function applyLike(){

  if(!unlocked) return;

  // si ya tiene like, no hace nada
  if(videoData.liked) return;

  videoData.liked = true;
  videoData.likes++;

  likeBtn.innerHTML = `
    <img src="Elementos Visuales/corazon2.png" class="heart-icon">
    <span>${videoData.likes}</span>
  `;

  }

  let clickTimeout;
  let lastDoubleTap = 0;

  video.addEventListener("dblclick",(e)=>{

    if(!unlocked){

      const lock = document.createElement("div");

      lock.className = "lock-animation";
      lock.innerHTML = "🔒";

      lock.style.left = `${e.clientX}px`;
      lock.style.top = `${e.clientY}px`;

      document.body.appendChild(lock);

      setTimeout(()=>{
        lock.remove();
      },1000);

      return;

    }

    applyLike();

    const heart = document.createElement("div");

    heart.className = "heart-animation";
    heart.innerHTML = "❤️";

    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    document.body.appendChild(heart);

    for(let i = 0; i < 8; i++){

      const particle = document.createElement("div");

      particle.className = "heart-particle";
      particle.innerHTML = "❤️";

      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;

      const randomX = (Math.random() - .5) * 180;
      const randomY = (Math.random() - .5) * 180;

      particle.style.setProperty("--x",`${randomX}px`);
      particle.style.setProperty("--y",`${randomY}px`);

      document.body.appendChild(particle);

      setTimeout(()=>{
        particle.remove();
      },900);

    }

    setTimeout(()=>{
      heart.remove();
    },800);

  });

  video.addEventListener('click',(e)=>{

  // ignorar clicks en botones
  if(
    e.target.closest(".action-mute-btn") ||
    e.target.closest(".likeBtn") ||
    e.target.closest(".commentBtn")
  ){
    return;
  }

  clearTimeout(clickTimeout);

  clickTimeout = setTimeout(()=>{

    if(video.paused){

      manuallyPaused = false;

      video.play().catch(()=>{});

      pauseIcon.classList.remove('active');

    }else{

      manuallyPaused = true;

      video.pause();

      pauseIcon.classList.add('active');

    }

  },220);

});

  commentBtn.addEventListener("click",()=>{

    currentComments = videoData.comments;

    openComments(currentComments);

  });

  likeBtn.addEventListener("click",()=>{ 
    applyLike();
  });

  videoFeed.appendChild(card);

});

function openComments(comments){

  commentsPanel.classList.add("active");

  commentsList.innerHTML = "";

  if(comments.length === 0){

    commentsList.innerHTML = `
      <p>No hay comentarios todavía.</p>
    `;

    return;

  }

  comments.forEach((comment)=>{

    commentsList.innerHTML += `
      <div class="comment">
        <strong>${comment.user}</strong>
        <p>${comment.text}</p>
      </div>
    `;

  });

}

document
.getElementById("closeComments")
.addEventListener("click",()=>{

  commentsPanel.classList.remove("active");

});

document
.getElementById("sendComment")
.addEventListener("click",()=>{

  const fullName =
  document.getElementById("fullName").value.trim();

  const commentText =
  document.getElementById("commentText").value.trim();

  if(fullName.length < 5 || !fullName.includes(" ")){

    alert("Ingresa nombre y apellido");
    return;

  }

  if(commentText === ""){

    alert("Escribe un comentario");
    return;

  }

  const newComment = {
    user:fullName,
    text:commentText
  };

  currentComments.push(newComment);

  openComments(currentComments);

  document.getElementById("commentText").value = "";

});
//#endregion

/*-------- Panel de Admin --------*/
function gestEst(){
  window.location.href = "estudiantes.html";
}