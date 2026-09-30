/* ---------- Auth ---------- */
const logo = `<div class="logo"><img src="assets/logo-unindra.png" alt="">LMS UNINDRA</div>`;
function login(err) {
  const makeCaptcha = () => {
    let first = Math.floor(Math.random() * 10);
    let second = Math.floor(Math.random() * 10);
    const subtract = Math.random() < 0.5;
    if (subtract && first < second) [first, second] = [second, first];
    return {
      question: `${first} ${subtract ? "-" : "+"} ${second} = ?`,
      answer: subtract ? first - second : first + second,
    };
  };
  let captcha = makeCaptcha();
  $("#app").innerHTML =
    `<div class="auth"><section class="auth-panel"><div class="card">${logo}<h4>Selamat datang 👋</h4><p class="mu">Masukkan Username (NPM) dan kata sandi Anda.</p>
<label for="u">Username</label><input class="inp" id="u" value="2210511001" autocomplete="username">
<label for="p">Kata sandi</label><input class="inp" id="p" type="password" value="demo1234" autocomplete="current-password">
<label for="captcha-answer">Captcha</label><p class="mu" id="captcha-question" style="margin:.25rem 0">${captcha.question}</p><input class="inp" id="captcha-answer" type="text" autocomplete="off" aria-label="Jawaban captcha">
<div class="row" style="margin:.9rem 0"><label style="margin:0;font-weight:400"><input type="checkbox" checked> Ingat saya</label><span class="sp"></span><a href="#lupa">Lupa kata sandi?</a></div>
<button class="btn" style="width:100%;justify-content:center" id="go">Masuk</button>
<div id="err" role="status">${err ? `<div class="alert b-er">${err}</div>` : ""}</div></div></section><aside class="auth-visual"><img src="assets/kampus-unindra.jpg" alt="Gedung kampus"><div class="auth-visual-copy"><span>UNIVERSITAS INDRAPRASTA PGRI</span><h2>Belajar, bertumbuh, dan berkarya.</h2><p>Ruang digital untuk perjalanan akademik Anda.</p></div></aside></div>`;
  $("#go").onclick = () => {
    if (!$("#u").value.trim() || !$("#p").value) {
      $("#err").innerHTML =
        '<div class="alert b-er">Username dan kata sandi wajib diisi.</div>';
      return;
    }
    const answer = $("#captcha-answer").value.trim();
    if (!/^\d+$/.test(answer) || Number(answer) !== captcha.answer) {
      $("#err").innerHTML =
        '<div class="alert b-er">Jawaban captcha salah. Silakan coba soal baru.</div>';
      captcha = makeCaptcha();
      $("#captcha-question").textContent = captcha.question;
      $("#captcha-answer").value = "";
      $("#captcha-answer").focus();
      return;
    }
    U.online = true;
    sessionStorage.setItem("lmsOnline", "true");
    go("dashboard");
  };
  const submitOnEnter = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      $("#go").click();
    }
  };
  $("#p").onkeydown = submitOnEnter;
  $("#captcha-answer").onkeydown = submitOnEnter;
}
function lupa() {
  $("#app").innerHTML =
    `<div class="auth"><section class="auth-panel"><div class="card">${logo}<h4>Lupa kata sandi? 🔒</h4><p class="mu">Masukkan email kampus Anda. Kami kirim tautan untuk mengatur ulang kata sandi.</p>
<label for="e">Email</label><input class="inp" id="e" type="email" placeholder="nama@mhs.kampus.ac.id"><div id="err" role="status"></div>
<button class="btn" style="width:100%;justify-content:center;margin-top:1rem" id="go">Kirim tautan reset</button><p style="text-align:center;margin-bottom:0"><a href="#login">‹ Kembali ke halaman masuk</a></p></div></section><aside class="auth-visual"><img src="assets/kampus-unindra.jpg" alt="Gedung kampus"><div class="auth-visual-copy"><span>UNIVERSITAS INDRAPRASTA PGRI</span><h2>UNINDRA selalu bersama langkah Anda.</h2><p>Kelola perjalanan akademik dalam satu ruang.</p></div></aside></div>`;
  $("#go").onclick = () => {
    const v = $("#e").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) {
      $("#err").innerHTML = '<div class="alert b-er">Masukkan alamat email yang valid.</div>';
      return;
    }
    $("#err").innerHTML = `<div class="alert b-ok">Tautan reset dikirim ke ${v}. Periksa kotak masuk Anda.</div>`;
  };
}
/* ---------- Shell ---------- */
function shell() {
  const cs = SEM["Ganjil 2026/2027"].c
    .slice()
    .sort(
      (a, b) =>
        ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].indexOf(a.hari) -
          ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].indexOf(b.hari) ||
        a.jam.localeCompare(b.jam),
    );
  $("#app").innerHTML =
    `<aside id="side"><div class="logo" style="justify-content:flex-start;padding:1rem .6rem 0;font-size:1.3rem"><img src="assets/logo-unindra.png" alt="">LMS UNINDRA</div>
<div class="me">${av(U.nama, 44, U.foto)}<div style="min-width:0"><b style="color:var(--hd)">${U.nama}</b><div class="mu"><span class="dot ${U.online ? "" : "off"}"></span>${U.online ? "Online" : "Offline"}</div></div></div>
<div class="sec">Menu Mahasiswa</div><div class="mi" data-r="dashboard">${ic("home")}Dashboard</div><div class="mi" data-r="presensi">${ic("cal")}Presensi</div><div class="mi" data-r="pesan">${ic("bell")}Notifikasi</div>
<div class="sec">Kelas</div><div style="padding:0 .3rem .5rem">${semSel("ss2")}</div><div id="cls">${sideCls()}</div></aside>
<div id="main"><header id="nav"><button class="ib hb" id="hb" aria-label="Menu">${ic("menu")}</button><b style="color:var(--hd);font-size:1.1rem">LMS UNINDRA</b>
<div class="row hide-s" style="margin-left:1rem;flex:1;color:var(--mu)">${ic("search")}<input class="inp" style="border:0;max-width:300px;background:transparent" placeholder="Cari mata kuliah, materi…" id="q"></div><span class="sp"></span>
<button class="ib" id="th" aria-label="Tema">${ic("moon")}</button><button class="ib" id="hp" aria-label="Bantuan">${ic("help")}</button>
<div class="dd" id="d2"><button class="ib" aria-label="Notifikasi">${ic("bell")}<i id="nb">${unr()}</i></button><div class="menu" id="nm">${msgMenu()}</div></div>
<div class="dd" id="d3"><button class="ib" aria-label="Profil" style="padding:0">${av(U.nama, 36, U.foto)}</button><div class="menu sm"><div class="mrow" style="cursor:default">${av(U.nama, 40, U.foto)}<div><b style="color:var(--hd)">${U.nama}</b><div class="mu">@${U.nim}</div><div class="mu">${U.tipe}</div></div></div>
<div class="mrow" data-r="profil" style="border-top:1px solid var(--bd)">${ic("user")}Profil saya</div><div class="mrow" id="lo">${ic("out")}Keluar</div></div></div></header><main id="page"></main></div>`;
  document.querySelectorAll(".dd>.ib").forEach(
    (b) =>
      (b.onclick = (e) => {
        e.stopPropagation();
        const d = b.parentNode,
          o = d.classList.contains("open");
        document
          .querySelectorAll(".dd")
          .forEach((x) => x.classList.remove("open"));
        if (!o) d.classList.add("open");
      }),
  );
  $("#hb").onclick = () => $("#side").classList.toggle("on");
  $("#th").onclick = () => {
    const r = document.documentElement,
      d =
        (r.dataset.theme ||
          (matchMedia("(prefers-color-scheme:dark)").matches
            ? "dark"
            : "light")) == "dark";
    r.dataset.theme = d ? "light" : "dark";
  };
  $("#hp").onclick = () =>
    modal(
      `<div class="card" style="max-width:460px;width:100%"><h4>Pusat bantuan</h4><p><b style="color:var(--hd)">Tidak bisa mengumpulkan tugas?</b><br>Pastikan format file sesuai dan ukurannya tidak melebihi batas.</p><p><b style="color:var(--hd)">Presensi keliru?</b><br>Hubungi dosen pengampu paling lambat 3 hari setelah pertemuan.</p><p><b style="color:var(--hd)">Kendala akun</b><br>helpdesk@kampus.ac.id · 021-555-0199 (Senin–Jumat, 08:00–16:00)</p><button class="btn" onclick="closeM()">Tutup</button></div>`,
    );
  $("#lo").onclick = () => {
    U.online = false;
    sessionStorage.removeItem("lmsOnline");
    go("login");
  };
  $("#q").onkeydown = (e) => {
    if (e.key == "Enter") {
      const v = e.target.value.toLowerCase(),
        c = cur().find((c) => c.nama.toLowerCase().includes(v));
      c ? go("kelas/" + c.id) : toast("Mata kuliah tidak ditemukan");
    }
  };
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dd"))
    document.querySelectorAll(".dd").forEach((x) => x.classList.remove("open"));
  const r = e.target.closest("[data-r]");
  if (r) {
    document.querySelectorAll(".dd").forEach((x) => x.classList.remove("open"));
    go(r.dataset.r);
    $("#side")?.classList.remove("on");
  }
  const m = e.target.closest("[data-m]");
  if (m) {
    document.querySelectorAll(".dd").forEach((x) => x.classList.remove("open"));
    msgOpen = +m.dataset.m;
    go("pesan");
    render();
  }
});
