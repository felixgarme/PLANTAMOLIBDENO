/**
 * v3d-audioSolo.js 🎧
 * Reproduce solo el audio de un video (.mp4) o un archivo de sonido (.mp3).
 *
 * Uso:
 *   audio("../media/a.mp4");   // con botón para ver video
 *   audio("../media/b.mp3");   // solo sonido
 *   quitarAudios();            // detiene y elimina todos los audios
 */

(function(){
  if(window.__v3d_audioSolo_inited) return;
  window.__v3d_audioSolo_inited = true;

  const audiosActivos = [];
  let botonMute = null;
  let muteado = false;

  // 🔹 Crear botón flotante centrado en la derecha
  function crearBotonMute(){
    if(botonMute) return;

    botonMute = document.createElement("button");
    botonMute.textContent = "🔊";
    botonMute.style.position = "fixed";
    botonMute.style.top = "50%";
    botonMute.style.right = "15px";
    botonMute.style.transform = "translateY(-50%)";
    botonMute.style.zIndex = "99999";
    botonMute.style.fontSize = "22px";
    botonMute.style.border = "none";
    botonMute.style.borderRadius = "50%";
    botonMute.style.width = "50px";
    botonMute.style.height = "50px";
    botonMute.style.cursor = "pointer";
    botonMute.style.background = "rgba(255,0,0,0.85)";
    botonMute.style.color = "#fff";
    botonMute.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
    botonMute.style.transition = "all 0.25s ease";

    botonMute.onmouseenter = () => botonMute.style.transform = "translateY(-50%) scale(1.1)";
    botonMute.onmouseleave = () => botonMute.style.transform = "translateY(-50%) scale(1)";

    botonMute.onclick = ()=>{
      muteado = !muteado;
      botonMute.textContent = muteado ? "🔇" : "🔊";
      audiosActivos.forEach(v=> v.muted = muteado );
      botonMute.style.background = muteado ? "rgba(100,100,100,0.85)" : "rgba(255,0,0,0.85)";
    };

    document.body.appendChild(botonMute);
  }

  // 🔹 Crea un botón para ver el video (si es mp4)
  function crearBotonVerVideo(ruta, elementoVideo){
    const btnVer = document.createElement("button");
    btnVer.textContent = "🎥";
    btnVer.style.position = "fixed";
    btnVer.style.top = "calc(50% + 70px)";
    btnVer.style.right = "15px";
    btnVer.style.transform = "translateY(-50%)";
    btnVer.style.zIndex = "99999";
    btnVer.style.fontSize = "22px";
    btnVer.style.border = "none";
    btnVer.style.borderRadius = "50%";
    btnVer.style.width = "50px";
    btnVer.style.height = "50px";
    btnVer.style.cursor = "pointer";
    btnVer.style.background = "rgba(0,0,255,0.8)";
    btnVer.style.color = "#fff";
    btnVer.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
    btnVer.style.transition = "all 0.25s ease";

    btnVer.setAttribute("data-video-ver", ruta);
    btnVer.onclick = ()=> mostrarVideoPopup(ruta, elementoVideo);

    document.body.appendChild(btnVer);
  }

  // 🔹 Mostrar el video en un popup centrado
  function mostrarVideoPopup(ruta, elementoOriginal){
    // Mutea el audio principal al abrir el video
    elementoOriginal.muted = true;
    muteado = true;
    if(botonMute){
      botonMute.textContent = "🔇";
      botonMute.style.background = "rgba(100,100,100,0.85)";
    }

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.zIndex = "100000";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const vidPopup = document.createElement("video");
    vidPopup.src = ruta;
    vidPopup.controls = true;
    vidPopup.autoplay = true;
    vidPopup.playsInline = true;
    vidPopup.style.maxWidth = "80%";
    vidPopup.style.maxHeight = "80%";
    vidPopup.style.border = "2px solid rgba(255,255,255,0.7)";
    vidPopup.style.borderRadius = "12px";
    vidPopup.style.boxShadow = "0 0 20px rgba(255,255,255,0.4)";

    const btnCerrar = document.createElement("button");
    btnCerrar.textContent = "✖";
    btnCerrar.style.position = "absolute";
    btnCerrar.style.top = "20px";
    btnCerrar.style.right = "30px";
    btnCerrar.style.fontSize = "26px";
    btnCerrar.style.border = "none";
    btnCerrar.style.background = "transparent";
    btnCerrar.style.color = "#fff";
    btnCerrar.style.cursor = "pointer";
    btnCerrar.style.textShadow = "0 0 6px rgba(0,0,0,0.6)";

    btnCerrar.onclick = ()=>{
      vidPopup.pause();
      overlay.remove();
      // Al cerrar, vuelve el mute al estado global
      elementoOriginal.muted = muteado;
    };

    overlay.appendChild(vidPopup);
    overlay.appendChild(btnCerrar);
    document.body.appendChild(overlay);
  }

  // 🔹 Reproduce el audio desde archivo o video
  function audio(ruta){
    crearBotonMute();

    let elemento;

    if(ruta.toLowerCase().endsWith(".mp3")){
      // 🎵 Si es MP3, usar etiqueta <audio>
      elemento = document.createElement("audio");
    } else {
      // 🎬 Si es MP4 u otro, usar <video> (solo audio)
      elemento = document.createElement("video");
      elemento.style.display = "none";
    }

    elemento.src = ruta;
    elemento.loop = true;
    elemento.autoplay = true;
    elemento.muted = muteado;
    elemento.volume = 1.0;
    elemento.playsInline = true;

    // asegura que se inicie al primer clic (por políticas de navegador)
    const iniciar = ()=>{
      elemento.play().catch(()=>{});
      document.removeEventListener("click", iniciar);
    };
    document.addEventListener("click", iniciar);

    document.body.appendChild(elemento);
    audiosActivos.push(elemento);

    // si es un video, crear el botón para verlo
    if(ruta.toLowerCase().endsWith(".mp4")){
      crearBotonVerVideo(ruta, elemento);
    }

    console.log(`%c[audioSolo] ▶️ Reproduciendo: ${ruta}`,"color:#0f0;");
  }

  // 🔹 Quita y detiene todos los audios activos
  function quitarAudios(){
    audiosActivos.forEach(v=>{
      v.pause();
      v.remove();
    });
    audiosActivos.length = 0;

    // Eliminar botones
    if(botonMute){ botonMute.remove(); botonMute = null; }
    const btnsVer = document.querySelectorAll("button[data-video-ver]");
    btnsVer.forEach(b=>b.remove());

    console.log("%c[audioSolo] ⏹️ Todos los audios detenidos","color:#f44;");
  }

  window.audio = audio;
  window.quitarAudios = quitarAudios;

  console.log("%c[v3d-audioSolo.js listo] Usa audio('ruta.mp4' o '.mp3');","color:#ff5555;font-weight:bold;");
})();
