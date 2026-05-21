// Function to generate the color of hexadecimal code
function randomHexadecimal() {
  // characters after the #
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  // we start with the #
  let hexCode = "#";
  // Generation of the hexadeimal code
  for (let i = 0; i < 6; i++) {
    hexCode += digits[Math.floor(Math.random() * digits.length)];
  }
  // hex should be of the form "#B3F211"
  return hexCode;
}

//Function to convert HEX to HSL
function hexToHSL(hex) {
  // 1. Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  console.log(r);
  console.log(g);
  console.log(b);

  // 2. Find max, min, and delta. h=hue, s=saturation, l=lightness
  let min = Math.min(r, g, b),
    max = Math.max(r, g, b),
    delta = max - min,
    h = 0,
    s = 0,
    l = 0;

  // 3. Calculate Lightness
  l = (max + min) / 2;

  // 4. Calculate Saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // 5. Calculate Hue
  if (delta == 0) h = 0;
  else if (max == r) h = ((g - b) / delta) % 6;
  else if (max == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // 6. Format to percentages
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

//Microfeedback function to inform the user of what has happened.
function microfeedback(mensaje) {
  const feedbackContainer = document.getElementById("micro-feedback");
  feedbackContainer.textContent = mensaje;
  feedbackContainer.classList.add("visible");
  setTimeout(function () {
    feedbackContainer.classList.remove("visible");
  }, 2000);
}

// Generation of the palette colors
function generatePalette() {
  // 1. Quantity of colors selected by the user
  const quantitySelected = parseInt(
    document.getElementById("palette-size").value,
  );

  // 2. get the container where pallet will be inserted
  const container = document.getElementById("palette-container");

  // 3. clean the last palette container
  container.innerHTML = "";

  // 4. create the cards according with the quantity of colors seleccted
  for (let i = 0; i < quantitySelected; i++) {
    const hex = randomHexadecimal();
    const hsl = hexToHSL(hex);

    //We create the <div>colorCode</div> elements
    const showHex = document.getElementById("hex").checked;
    const colorCodeDisplay = document.createElement("div");
    colorCodeDisplay.classList.add("code-style");

    // Storage hex and hsl codes in the element
    colorCodeDisplay.setAttribute("data-hex", hex);
    colorCodeDisplay.setAttribute("data-hsl", hsl);

    colorCodeDisplay.textContent = showHex ? hex : hsl;

    //We create the each card which will contain the color and the code (hex or hsl)
    const cardDisplay = document.createElement("div");
    cardDisplay.classList.add("card-style");
    cardDisplay.setAttribute("role", "listitem");
    cardDisplay.setAttribute("tabindex", "0");
    cardDisplay.setAttribute(
      "title",
      `Clic para copiar ${showHex ? hex : hsl}`,
    );

    //We create the color which will be inserted in each card
    const colorDisplay = document.createElement("div");
    colorDisplay.classList.add("color-display");
    colorDisplay.style.backgroundColor = showHex ? hex : hsl;

    //We put it all together: indise the cardDisplay we insert the color and the colorCode
    cardDisplay.appendChild(colorDisplay);
    cardDisplay.appendChild(colorCodeDisplay);

    // We insert the cardDisplay which has de palette color in the DOM
    container.appendChild(cardDisplay);

    //We create the event to copy the color code
    cardDisplay.addEventListener("click", function () {
      // navigator.clipboard.writeText() copia texto al portapapeles
      // Devuelve una Promesa (.then) que se ejecuta cuando termina
      navigator.clipboard.writeText(showHex ? hex : hsl).then(function () {
        microfeedback(`Copied! ${showHex ? hex : hsl}`);
      });
    });
  }

  microfeedback("Palette generated succesfully");
}

const generateBtn = document.getElementById("generate-button");
generateBtn.addEventListener("click", generatePalette);

//Listener for changing color Code
// 1. Put this OUTSIDE generarPaleta() so it only runs once!
const radioInputs = document.querySelectorAll('input[name="encoding"]');

radioInputs.forEach((input) => {
  input.addEventListener("change", function () {
    const showHex = document.getElementById("hex").checked;
    // 2. Select ALL cards on the screen
    const allCards = document.querySelectorAll(".card-style");
    console.log(allCards);

    allCards.forEach((card) => {
      const colorCodeDisplay = card.querySelector(".code-style");
      console.log(colorCodeDisplay.textContent);
      // 3. Find the text display inside this specific card

      colorCodeDisplay.textContent = showHex
        ? colorCodeDisplay.dataset.hex
        : colorCodeDisplay.dataset.hsl;
      console.log(colorCodeDisplay.textContent);
      console.log(colorCodeDisplay);

      card.setAttribute(
        "title",
        `Clic para copiar ${showHex ? colorCodeDisplay.dataset.hex : colorCodeDisplay.dataset.hsl}`,
      );

      card.addEventListener("click", function () {
        // navigator.clipboard.writeText() copia texto al portapapeles
        // Devuelve una Promesa (.then) que se ejecuta cuando termina
        navigator.clipboard
          .writeText(
            showHex
              ? colorCodeDisplay.dataset.hex
              : colorCodeDisplay.dataset.hsl,
          )
          .then(function () {
            microfeedback(
              `Copied! ${showHex ? colorCodeDisplay.dataset.hex : colorCodeDisplay.dataset.hsl}`,
            );
          });
      });
    });
  });
});
