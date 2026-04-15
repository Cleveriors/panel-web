const firebaseConfig = {
  apiKey: "AIzaSyAtRorkiBlWz16av5EmHBQM_vTbDh7H9uI",
  authDomain: "fake-gps-ios.firebaseapp.com",
  databaseURL: "https://fake-gps-ios-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "fake-gps-ios"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// AUTO USER
let uid = localStorage.getItem("fakegps_uid");

if (!uid) {
  uid = "user_" + Math.random().toString(36).substring(2,10);
  localStorage.setItem("fakegps_uid", uid);
}

document.getElementById("uid").innerText = "ID: " + uid;

// MAP
const map = L.map('map').setView([-6.2, 106.8], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

let marker;

// klik map
map.on('click', (e) => {
  setLocation(e.latlng.lat, e.latlng.lng);
});

function setLocation(lat, lng) {
  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 13);

  db.ref("gps/" + uid).set({ lat, lng });
}

// search lokasi
async function searchLocation() {
  const q = document.getElementById("search").value;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
  const data = await res.json();

  if (!data.length) return alert("Tidak ditemukan");

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  setLocation(lat, lng);
}

// random
function random() {
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;

  setLocation(lat, lng);
}

// auto move
function autoMove() {
  let lat = -6.2;
  let lng = 106.8;

  setInterval(() => {
    lat += (Math.random() - 0.5) * 0.0005;
    lng += (Math.random() - 0.5) * 0.0005;

    setLocation(lat, lng);
  }, 2000);
}