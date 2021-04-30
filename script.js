// script.js



const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
const canvasWidth = 400;
const canvasHeight = 400;

document.getElementById("voice-selection").disabled = false;
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // // TODO
  // * toggle the relevant buttons (submit, clear, and read text buttons) by disabling or enabling them as needed
  // * What happens if they don't upload an image
 
  
  ctx.fillStyle= 'black';

  // clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);


  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  let dimensions = getDimmensions(canvasWidth, canvasHeight, img.width, img.height);
  console.log(dimensions);
  
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
  
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const image_input = document.getElementById("image-input");
image_input.addEventListener('change', () => {
// console.log(typeof image_input.files[0]);
  img.src = URL.createObjectURL(image_input.files[0]);
  img.alt = image_input.files[0].name;
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

//const form = document.querySelector('button[type="submit"]'); 
const form = document.getElementById("generate-meme"); 
const toggle = document.getElementById("button-group");
const top_text = document.getElementById("text-top"); 
const bottom_text = document.getElementById("text-bottom");

var utterThis = new SpeechSynthesisUtterance(); 
var utterThisToo = new SpeechSynthesisUtterance();

form.addEventListener('submit', event => {
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "white";
  //ctx.textAlign = "center";
  ctx.fillText(top_text.value, canvasWidth - 390, canvasHeight - 350);
  ctx.fillText(bottom_text.value, canvasWidth - 390, canvasHeight - 10);

  toggle.children[0].disabled = false; 
  toggle.children[1].disabled = false; 
  // utterThis = new SpeechSynthesisUtterance(top_text.value);
  utterThis.text=top_text.value;
  // utterThisToo = new SpeechSynthesisUtterance(bottom_text.value);
  utterThisToo.text = bottom_text.value;
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
  if(voices[i].name === selectedOption) {
    utterThis.voice = voices[i];
    utterThisToo.voice = voices[i]; 
  }
}
  event.preventDefault();
}); 

toggle.children[0].addEventListener('click', event => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  top_text.value = ""; 
  bottom_text.value = ""; 
  toggle.children[0].disabled = true; 
  toggle.children[1].disabled = true; 
});

var voiceSelect = document.getElementById("voice-selection"); 
var voices; 
 
let volume = document.querySelector("[type='range']");

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  voices = speechSynthesis.getVoices();
  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
      voiceSelect.remove(0); 
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

toggle.children[1].addEventListener('click', event => {
  speechSynthesis.speak(utterThis);
  speechSynthesis.speak(utterThisToo); 
});

volume.addEventListener("change", function(e) {
  let volImg = document.getElementById("volume-group"); 
  if (volume.value >= 67 && volume.value <= 100) {
    volImg.children[0].src = "icons/volume-level-3.svg"; 
  }
  else if (volume.value >= 34 && volume.value <= 66) {
    volImg.children[0].src = "icons/volume-level-2.svg"; 
  }
  else if (volume.value >= 1 && volume.value <= 33) {
    volImg.children[0].src = "icons/volume-level-1.svg"; 
  }
  else {
    volImg.children[0].src = "icons/volume-level-0.svg"; 
  }
  console.log(volImg.children[1].src); 

  // TODO: What happens when you don't have an image uploaded yet
  utterThis.volume = e.currentTarget.value / 100;
  utterThisToo.volume = e.currentTarget.value / 100;
}); 