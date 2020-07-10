// mostrar el tamaño de la pantalla
const screenRestTop = () => {
    let [body, w, h, screen] = '';
    body = document.querySelector('body');
    body.innerHTML += `<div id="screenRes"></div>`;
    w = window.innerWidth;
    h = window.innerHeight;
    screen = document.querySelector('#screenRes');
    screen.innerHTML = `${w} x ${h}`;
    Object.assign(screen.style, {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: '10px',
        color: 'red',
        position: 'fixed',
        top: '1px',
        left: '1px',
        zIndex: 50,
    })
};
window.addEventListener('load', screenRestTop);
window.addEventListener('resize', screenRestTop);

// Generando template colores
const colors = document.querySelector('.colors');
const colorsQTY = 1;
const colorTemplate = (index) => {
    return `<div class="color">
    <h2>
      HEX
    </h2>
    <div class="controls">
      <button class="adjust"><i class="fas fa-sliders-h"></i></button>
      <button class="lock"><i class="fas fa-lock-open"></i></button>
    </div>
    <div class="sliders">
      <button class="close-adjustment">X</button>
      <span>HUE</span>
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        name="hue"
        class="hue-input"
        data-hue="${index}"
      />
      <span>Brightness</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        name="brightness"
        class="bright-input"
        data-bright="${index}"
      />
      <span>Saturation</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        name="saturation"
        class="sat-input"
        data-sat="${index}"
      />
    </div>
  </div>`;
}
for (let i = 0; i < colorsQTY; i++) {
    colors.innerHTML += colorTemplate(i);
}