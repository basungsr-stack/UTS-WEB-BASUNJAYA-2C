"use strict";

/* ---------- 1. Dark mode toggle ---------- */
function setTema(tema) {
  document.documentElement.setAttribute("data-bs-theme", tema);
  const tombol = document.getElementById("themeToggle");
  tombol.textContent = tema === "dark" ? "Mode terang" : "Mode gelap";
  tombol.setAttribute("aria-pressed", String(tema === "dark"));
  try { localStorage.setItem("tema", tema); } catch (e) { /* abaikan */ }
}
function toggleTema() {
  const sekarang = document.documentElement.getAttribute("data-bs-theme");
  setTema(sekarang === "dark" ? "light" : "dark");
}

/* ---------- 2. Filter + pencarian proyek ---------- */
let filterAktif = "semua";
function tampilkanProyek() {
  const kata = document.getElementById("cariProyek").value.trim().toLowerCase();
  let jumlah = 0;
  document.querySelectorAll(".proyek").forEach(function (kartu) {
    const cocokKategori = filterAktif === "semua" || kartu.dataset.kategori.split(" ").includes(filterAktif);
    const cocokKata = kartu.textContent.toLowerCase().includes(kata);
    const tampil = cocokKategori && cocokKata;
    kartu.classList.toggle("d-none", !tampil);
    if (tampil) jumlah++;
  });
  document.getElementById("kosong").classList.toggle("d-none", jumlah > 0);
}
function pilihFilter(event) {
  filterAktif = event.currentTarget.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    const aktif = btn === event.currentTarget;
    btn.classList.toggle("btn-primary", aktif);
    btn.classList.toggle("btn-outline-primary", !aktif);
  });
  tampilkanProyek();
}

/* ---------- 3. Kalkulator estimasi biaya ---------- */
function formatRupiah(angka) {
  return "Rp" + Math.round(angka).toLocaleString("id-ID");
}
function hitungEstimasi(tarif, layar, revisi, kilat) {
  const dasar = tarif * layar;
  const biayaRevisi = revisi > 2 ? (revisi - 2) * 0.1 * dasar : 0; // 2 revisi pertama gratis
  const subtotal = dasar + biayaRevisi;
  const biayaKilat = kilat ? subtotal * 0.3 : 0;
  return { dasar: dasar, biayaRevisi: biayaRevisi, biayaKilat: biayaKilat, total: subtotal + biayaKilat };
}
function prosesEstimasi(event) {
  event.preventDefault();
  const tarif = Number(document.getElementById("jenis").value);
  const layar = parseInt(document.getElementById("layar").value, 10);
  const revisi = parseInt(document.getElementById("revisi").value, 10);
  const kilat = document.getElementById("kilat").checked;
  const total = document.getElementById("hasilTotal");
  const rincian = document.getElementById("hasilRincian");
  if (!(layar >= 1) || !(revisi >= 0)) {
    total.textContent = "Rp0";
    rincian.textContent = "Jumlah layar minimal 1 dan revisi minimal 0.";
    return;
  }
  const h = hitungEstimasi(tarif, layar, revisi, kilat);
  total.textContent = formatRupiah(h.total);
  rincian.textContent = "Desain " + layar + " layar " + formatRupiah(h.dasar) +
    ", revisi tambahan " + formatRupiah(h.biayaRevisi) +
    ", biaya kilat " + formatRupiah(h.biayaKilat) + ".";
}

/* ---------- 4. Validasi form kontak ---------- */
function setValid(input, valid) {
  input.classList.toggle("is-valid", valid);
  input.classList.toggle("is-invalid", !valid);
  return valid;
}
function validasiKontak(event) {
  event.preventDefault();
  const nama = document.getElementById("nama");
  const email = document.getElementById("email");
  const pesan = document.getElementById("pesan");
  const status = document.getElementById("statusKontak");
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const a = setValid(nama, nama.value.trim().length >= 3);
  const b = setValid(email, polaEmail.test(email.value.trim()));
  const c = setValid(pesan, pesan.value.trim().length >= 10);
  if (a && b && c) {
    status.className = "mt-3 alert alert-success";
    status.textContent = "Terima kasih, " + nama.value.trim() + ". Pesan Anda sudah tercatat.";
    event.target.reset();
    [nama, email, pesan].forEach(function (el) { el.classList.remove("is-valid"); });
  } else {
    status.className = "mt-3 alert alert-danger";
    status.textContent = "Pesan belum terkirim. Periksa kolom yang ditandai merah.";
  }
}

/* ---------- Inisialisasi ---------- */
document.addEventListener("DOMContentLoaded", function () {
  let tersimpan = null;
  try { tersimpan = localStorage.getItem("tema"); } catch (e) { /* abaikan */ }
  setTema(tersimpan || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  document.getElementById("themeToggle").addEventListener("click", toggleTema);
  document.getElementById("cariProyek").addEventListener("input", tampilkanProyek);
  document.querySelectorAll(".filter-btn").forEach(function (b) { b.addEventListener("click", pilihFilter); });
  document.getElementById("formEstimasi").addEventListener("submit", prosesEstimasi);
  document.getElementById("formKontak").addEventListener("submit", validasiKontak);
});
