// =======================
// INIT MAP
// =======================
const map = L.map("map").setView([-6.475, 106.456], 11);

// =======================
// BASE MAP
// =======================
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// =======================
// ICON
// =======================
const iconTitik = L.icon({
  iconUrl: "../../icon/pointRed.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30]
});

// =======================
// MARKER GROUP
// =======================
const markerGroup = L.layerGroup().addTo(map);

// =======================
// MARKER UTAMA (PENDOPO)
// =======================
L.marker([-6.501303, 106.497210], { icon: iconTitik })
  .addTo(markerGroup)
  .bindPopup("<b>Pendopo Jasinga</b><br>Monumen Sejarah");

// =======================
// FETCH & RENDER DATA WISATA
// =======================
fetch("../../data/wisata.json")
  .then(res => {
    if (!res.ok) throw new Error("Gagal memuat JSON");
    return res.json();
  })
  .then(data => {
    console.log("✅ Data wisata:", data);

    data.forEach(item => {
      // VALIDASI KOORDINAT
      if (!item.koordinat || item.koordinat.length !== 2) return;

      const marker = L.marker(item.koordinat, {
        icon: iconTitik
      });

      marker.bindPopup(`
        <b>${item.nama}</b><br>
        ${item.deskripsi || ""}
      `);

      markerGroup.addLayer(marker);
    });
  })
  .catch(err => console.error(err));

// =======================
// GEOJSON BATAS DESA
// =======================
fetch("../../data/bts_desa_jasinga.geojson")
  .then(res => {
    if (!res.ok) throw new Error("GeoJSON gagal dimuat");
    return res.json();
  })
  .then(data => {
    const batasDesa = L.geoJSON(data, {
      style: {
        color: "green",
        weight: 1,
        fillOpacity: 0.1
      }
    }).addTo(map);

    // Auto zoom ke batas desa
    map.fitBounds(batasDesa.getBounds());
  })
  .catch(err => console.error(err));
