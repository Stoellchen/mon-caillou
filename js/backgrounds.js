(function () {
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  window.initRotatingBackgrounds = function initRotatingBackgrounds(options) {
    const {
      images = [],
      intervalMs = 25000,
      randomOrder = true,
      crossfadeMs = 1800,
      layerAId = "bgA",
      layerBId = "bgB"
    } = options || {};

    const layerA = document.getElementById(layerAId);
    const layerB = document.getElementById(layerBId);

    if (!layerA || !layerB || !images.length) return;

    layerA.style.transitionDuration = `${crossfadeMs}ms`;
    layerB.style.transitionDuration = `${crossfadeMs}ms`;

    let playlist = randomOrder ? shuffleArray(images) : [...images];
    let index = 0;
    let activeLayer = layerA;
    let idleLayer = layerB;

    function nextImage() {
      if (index >= playlist.length) {
        playlist = randomOrder ? shuffleArray(images) : [...images];
        index = 0;
      }
      return playlist[index++];
    }

  async function swapBackground(first = false) {
    const src = nextImage();

    await preloadImage(src);

    idleLayer.style.backgroundImage = `url("${src}")`;

    const colorLayer = document.getElementById("bgColor");
    if (colorLayer) {
      colorLayer.style.backgroundImage = `url("${src}")`;
    }

    if (first) {
      // 👉 erstes Bild SOFORT anzeigen (kein Fade)
      idleLayer.style.opacity = "1";

      activeLayer.style.opacity = "0";

      // Layer tauschen
      const tmp = activeLayer;
      activeLayer = idleLayer;
      idleLayer = tmp;

      return;
    }

    // 👉 normale Crossfade Animation
    requestAnimationFrame(() => {
      idleLayer.style.opacity = "1";
      activeLayer.style.opacity = "0";
    });

    setTimeout(() => {
      const tmp = activeLayer;
      activeLayer = idleLayer;
      idleLayer = tmp;
    }, crossfadeMs + 50);
  }

    
    swapBackground(true);
    setInterval(() => {
      swapBackground(false);
    }, intervalMs);
  };
})();


// 👉 Spotlight Overlay erzeugen
function createSpotlight() {
  const wrap = document.getElementById("bg-wrap");
  if (!wrap) return;

  const spot = document.createElement("div");
  spot.id = "bg-spotlight";

  spot.style.position = "absolute";
  spot.style.inset = "0";
  spot.style.pointerEvents = "none";
  spot.style.zIndex = "1";

  // 👉 initialer Spotlight (leicht warm gelb)
  spot.style.background = `
    radial-gradient(
      circle at 50% 50%,
      rgba(255,220,120,0.25) 0%,
      rgba(255,220,120,0.15) 20%,
      rgba(0,0,0,0) 45%
    )
  `;

  wrap.appendChild(spot);

  return spot;
}

function enableDynamicSpotlight(spot) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;

    spot.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255,220,120,0.30) 0%,
        rgba(255,220,120,0.18) 15%,
        rgba(0,0,0,0) 40%
      )
    `;
  });
}

function createColorLayer() {
  const wrap = document.getElementById("bg-wrap");
  if (!wrap) return;

  const layer = document.createElement("div");
  layer.id = "bgColor";

  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.backgroundSize = "cover";
  layer.style.backgroundPosition = "center center";
  layer.style.backgroundRepeat = "no-repeat";
  layer.style.zIndex = "2";
  layer.style.pointerEvents = "none";

  // 👉 KEIN filter → echte Farben
  layer.style.opacity = "1";
  layer.style.maskImage = `
    radial-gradient(
      circle at 50% 50%,
      rgba(0,0,0,0) 0px,
      rgba(0,0,0,0) 0px,
      rgba(0,0,0,0) 1px
    )
  `;
  layer.style.webkitMaskImage = layer.style.maskImage;

  wrap.appendChild(layer);

  return layer;
}

function updateColorSpotlight(layer, x, y) {
  layer.style.maskImage = `
    radial-gradient(
      circle at ${x}px ${y}px,
      rgba(0,0,0,1) 0%,
      rgba(0,0,0,1) 80px,
      rgba(0,0,0,0.7) 140px,
      rgba(0,0,0,0) 260px
    )
  `;

  layer.style.webkitMaskImage = layer.style.maskImage;
}



// 👉 AUTO INIT (Default Config)
document.addEventListener("DOMContentLoaded", () => {

  // nur starten wenn bg vorhanden ist
  if (!document.getElementById("bgA")) return;

  const spot = createSpotlight();

  // 👉 optional aktivieren
  enableDynamicSpotlight(spot);

  const colorLayer = createColorLayer();

  // Desktop
  window.addEventListener("mousemove", (e) => {
    updateColorSpotlight(colorLayer, e.clientX, e.clientY);
  });

  // Mobile / Tablet
  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (!t) return;
    updateColorSpotlight(colorLayer, t.clientX, t.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    updateColorSpotlight(colorLayer, t.clientX, t.clientY);
  }, { passive: true });

  initRotatingBackgrounds({
    images: [
      "images/background_01.png",
      "images/background_02.png",
      "images/background_03.png",
      "images/background_04.png",
      "images/background_05.png",
      "images/background_06.png",
      "images/background_07.png",
      "images/background_08.png",
      "images/background_09.png",
      "images/background_10.png",
      "images/background_11.png",
      "images/background_12.png",
      "images/background_13.png",
      "images/background_14.png",
      "images/background_15.png",
      "images/background_16.png",
      "images/background_17.png",
      "images/background_18.png",
      "images/background_19.png",
      "images/background_20.png",
      "images/background_31.png",
      "images/background_32.png",
      "images/background_33.png",
      "images/background_34.png",
      "images/background_35.png",
      "images/background_36.png",
      "images/background_37.png",
      "images/background_38.png",
      "images/background_39.png",
      "images/background_40.png",
      "images/background_41.png",
      "images/background_42.png",
      "images/background_43.png",
      "images/background_44.png",
      "images/background_45.png",
      "images/background_46.png",
      "images/background_47.png",
      "images/background_48.png"
    ],
    intervalMs: 9000,
    randomOrder: true,
    crossfadeMs: 1800
  });

});
