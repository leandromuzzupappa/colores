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

// Creando template colores
const colors = document.querySelector('.colors');
const colorsQTY = 2;
const colorTemplate = (index) => {
    return `<div class="color">
    <h2>
      HEX
    </h2>
    <div class="controls">
      <button class="adjust"><i class="fas fa-sliders-h"></i></button>
      <button class="lock"><i class="fas fa-lock-open"></i></button>
    </div>
    <div class="sliders active">
      <button class="close-adjustment">X</button>
      <span>Hue</span>
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

// Tengo que esperar a que el template
// este completamente cargado
window.addEventListener('load', ()=> {
  const colorDivs = document.querySelectorAll('.color');
  const generateBtn = document.querySelector('.generate');
  const sliders = document.querySelectorAll('input[type="range"]');
  const currentHexes = document.querySelectorAll('.color h2');
  let initialColors;

  // Generando el hex
  const generateHex = () => chroma.random();

  function randomColor (){
      initialColors = [];
      colorDivs.forEach((div, index) => {

          let hexText = div.children[0];
          let randomColor = generateHex();

          // Agrego el color a un array
          // para cuando cambie el brillo no
          // tome el color del div
          initialColors.push(chroma(randomColor).hex());

          div.style.backgroundColor = randomColor;
          hexText.innerText = randomColor;

          // Checkeando contraste
          checkTextContrast(randomColor, hexText);

          // Instanciando el slider
          let color = chroma(randomColor);
          let sliders = div.querySelectorAll('.sliders input');
          let hue = sliders[0];
          let brightness = sliders[1];
          let saturation = sliders[2];

          colorizeSliders(color, hue, brightness, saturation);
      });

      console.log(initialColors);
  }

  // Checkeando el contraste del texto
  function checkTextContrast(color, text) {
      const luminance = chroma(color).luminance();
      luminance > .5 ? text.style.color = '#333333' : text.style.color = '#f7f7f7';
  }

  // Inicializando los sliders de los colores
  sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
  })
  colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
      updateTextUI(index);
    })
  })

  function colorizeSliders(color, hue, brightness, saturation) {
    // Saturation
    const nonSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([nonSat, color, fullSat]);

    // Brighness
    const midBright = color.set('hsl.s', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    // updating inputs
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0), rgb(255,255 ,0),rgb(0, 255, 0),rgb(0, 255, 255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))`;
  }

  function hslControls(e) {
    let index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-sat') || e.target.getAttribute('data-hue');
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]
    //const bgColor = colorDivs[index].querySelector('h2').innerText;
    const bgColor = initialColors[index];
    

    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);

    colorDivs[index].style.backgroundColor = color;

  }

  function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');

    textHex.innerText = color.hex();

    // check contraste
    checkTextContrast(color, textHex);
    for (icon of icons) {
      checkTextContrast(color, icon);
    }
  }

  randomColor();
})