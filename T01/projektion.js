console.log("hallo");

let frameX = 720;
let frameY = 360;
let factor = frameX / 360;
let factorY = frameY / 180;
let longitude;
let latitude;
let coordinateX;
let coordinateY;


//Ort muss immer lat und long als wert besitzen und einen Namen
//jeder ort verschiedene Werte annehmen
class Ort {
  constructor(name, longitude, latitude) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

const myLocation1 = new Ort("Ort1", 60, 30);

function longToX() {
    coordinateX = (longitude+180)*factor
    console.log(coordinateX)
}
longToX()

function longToY() {
    coordinateY = (latitude*(-1)+90)*factorY
    console.log(coordinateY)
}
longToY()


//Ort mit long die am nächsten zu 0 ist muss als "wärmster Ort definiert werden"
function difToEquator() 
console.log(wärmsterOrt)
}


//welcher Ort ist am wärmsten, bzw liegt am nächsten am Äquator?

