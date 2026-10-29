const fs = require("fs"); // ganz oben

const roh = fs.readFileSync("orte.json", "utf8");
const orte = JSON.parse(roh);
console.log(roh)
console.log(orte)


 
const ERDRADIUS = 6371000;                          // mittlerer Erdradius in Metern
const METER_PRO_GRAD = (2 * Math.PI * ERDRADIUS) / 360; // ≈ 111 195 m pro Grad
const zuRad = (grad) => (grad * Math.PI) / 180;
 
function istGueltigerBreitengrad(lat) {
  return typeof lat === "number" && Number.isFinite(lat) && lat >= -90 && lat <= 90;
}
 
function istGueltigerLaengengrad(lon) {
  return typeof lon === "number" && Number.isFinite(lon) && lon >= -180 && lon <= 180;
}
 
function entfernung(a, b) {
  for (const ort of [a, b]) {
    if (!ort || !istGueltigerBreitengrad(ort.lat) || !istGueltigerLaengengrad(ort.lon)) {
      throw new Error(`Ungültige Koordinaten: ${JSON.stringify(ort)}`);
    }
  }
 
  // 1. Steigungsdreieck: Differenzen der Koordinaten in Grad
  const dLat = b.lat - a.lat;
  let dLon = b.lon - a.lon;
  // kürzeren Weg über die Datumsgrenze nehmen (z. B. 170° → -170° sind nur 20°)
  if (dLon > 180) dLon -= 360;
  if (dLon < -180) dLon += 360;
 
  // Pythagoras im "flachen" Koordinatensystem
  const abstandGrad = Math.sqrt(dLat ** 2 + dLon ** 2);
 
  // 2. Umrechnung Grad → Meter (ohne Verzerrung)
  const naivMeter = abstandGrad * METER_PRO_GRAD;
 
  // 3. Verzerrung Richtung Pole: Längengrade rücken zusammen, Faktor cos(Breite)
  const mittlereBreite = zuRad((a.lat + b.lat) / 2);
  const verzerrungsfaktor = Math.cos(mittlereBreite);
  const dLonKorrigiert = dLon * verzerrungsfaktor;
  const korrigiertMeter = Math.sqrt(dLat ** 2 + dLonKorrigiert ** 2) * METER_PRO_GRAD;
 
  // Referenz: exakte Großkreisentfernung auf der Kugel (Haversine)
  const h =
    Math.sin(zuRad(dLat) / 2) ** 2 +
    Math.cos(zuRad(a.lat)) * Math.cos(zuRad(b.lat)) * Math.sin(zuRad(dLon) / 2) ** 2;
  const haversineMeter = 2 * ERDRADIUS * Math.asin(Math.sqrt(h));
 
  return { abstandGrad, naivMeter, verzerrungsfaktor, korrigiertMeter, haversineMeter };
}
 
function entfernungZwischen(name1, name2) {
  const finde = (name) => {
    const ort = orte.find((o) => o.name === name);
    if (!ort) throw new Error(`Ort nicht gefunden: ${name}`);
    return ort;
  };
  return entfernung(finde(name1), finde(name2));
}
 
// Beispielausgabe
const paare = [
    ["Schwäbisch Gmünd", "Stuttgart"]
//   ["Nullinsel", "Prüfpunkt Ost"],
//   ["Spitzbergen", "Prüfpunkt Nord"],
//   ["Schwäbisch Gmünd", "Stuttgart"],
//   ["Stuttgart", "Kapstadt"],
//   ["Stuttgart", "NYC"],
];
 
const km = (m) => (m / 1000).toFixed(1).padStart(8) + " km";
// for (const [x, y] of paare) {
//   const e = entfernungZwischen(x, y);
//   console.log(
//     `${(x + " → " + y).padEnd(34)} naiv:${km(e.naivMeter)}  korrigiert:${km(e.korrigiertMeter)}` +
//       `  Kugel:${km(e.haversineMeter)}  (Faktor ${e.verzerrungsfaktor.toFixed(3)})`
//   );
// }

console.log(km(entfernungZwischen("Schwäbisch Gmünd", "Stuttgart").korrigiertMeter));
 