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

// Traer cantidad de colores por url
const getQTYFromURL = () => {
  let url = new URL(window.location.href);
  return url.searchParams.get('colors');
}

// Creando template colores
const colors = document.querySelector('.colors');
const colorsQTY = getQTYFromURL() === null ? 2 : getQTYFromURL();
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
  const generateBtn = document.querySelector('.panel-generate button');
  const sliders = document.querySelectorAll('input[type="range"]');
  const currentHexes = document.querySelectorAll('.color h2');
  const pupContainer = document.querySelector('.copy-container');
  const adjustBtn = document.querySelectorAll('.adjust');
  const closeAdjustments = document.querySelectorAll('.close-adjustment');
  const slidersContainer = document.querySelectorAll('.sliders');
  const lockBtn = document.querySelectorAll('.lock');
  const controls = document.querySelectorAll('.controls');
  let initialColors;

  // Generando el hex
  const generateHex = () => chroma.random();

  // Generar nuevos colores
  generateBtn.addEventListener('click', randomColor);

  function randomColor (){
      initialColors = [];
      colorDivs.forEach((div, index) => {
          console.log(div);
          let hexText = div.children[0];
          let randomColor = generateHex();

          if (div.classList.contains('locked')) {
            initialColors.push(hexText.innerText);
            return;
          } else {
            // Agrego el color a un array
            // para cuando cambie el brillo no
            // tome el color del div
            initialColors.push(chroma(randomColor).hex());
          }

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
      resetInputs();

      // Check contrast buttons
      adjustBtn.forEach((btn, index)=>{
        checkTextContrast(initialColors[index], btn);
        checkTextContrast(initialColors[index], lockBtn[index]);
      })
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
    // live update sliders
    colorizeSliders(color, hue, brightness, saturation);
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

  function resetInputs () {
    // Recibe el objecto, el data atributo de los sliders y
    // un int del hsl. h -> 0, s -> 1, l -> 2
    const setInputValue = (object, dataSlider, hslIndex) => {
      const inputColor = initialColors[object.getAttribute(dataSlider)];
      const inputValue = chroma(inputColor).hsl()[hslIndex];
      object.value = Math.floor(inputValue * 100) / 100;
    }

    sliders.forEach(slider => {
      if (slider.name === 'hue') {
        setInputValue(slider, 'data-hue', 0);
      }
      if (slider.name === 'brightness') {
        setInputValue(slider, 'data-bright', 1);
      }
      if (slider.name === 'saturation') {
        setInputValue(slider, 'data-sat', 2);
      }
    })
  }

  // Copiar
  currentHexes.forEach(hex => {
    hex.addEventListener('click', ()=>{
      copyToClipboard(hex);
    })
  })

  function copyToClipboard(hex) {
    // Creo un textarea y le inserto el hex
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);

    // Copio el value
    el.select();
    document.execCommand('copy');

    // Borro el textarea
    document.body.removeChild(el);

    const pup = pupContainer.children[0];
    pupContainer.classList.add('active');
    pup.classList.add('active');

    // Cerrar pup
    setTimeout(()=>{
      pupContainer.classList.remove('active');
      pup.classList.remove('active');
    }, 700);
  }

  // Abrir el panel de ajustes de color
  adjustBtn.forEach((btn, index)=>{
    btn.addEventListener('click', ()=>{
      slidersContainer[index].classList.add('active');
      controls[index].classList.add('active');
    })
  })
  closeAdjustments.forEach((btn, index)=>{
    btn.addEventListener('click', ()=>{
      slidersContainer[index].classList.remove('active');
      controls[index].classList.remove('active');
    })
  })

  // Lock
  lockBtn.forEach((button, index)=>{
    button.addEventListener('click', ()=>{
      let icon = button.children[0];
      //colorDivs[index].classList.add('locked');

      if (colorDivs[index].classList.contains('locked')) {
        colorDivs[index].classList.remove('locked');
        icon.classList.remove('fa-lock');
        icon.classList.add('fa-lock-open');
      } else {
        colorDivs[index].classList.add('locked');
        icon.classList.remove('fa-lock-open');
        icon.classList.add('fa-lock');
      }

    })
  })

  randomColor();
})