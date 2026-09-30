/* notifikasi */
const vis = () => MSG.map((m, i) => i).filter((i) => !DEL["m" + i]),
  unr = () => vis().filter((i) => !RD["m" + i]).length;
function msgMenu() {
  const v = vis();
  return `<div class="row" style="padding:.8rem 1rem;border-bottom:1px solid var(--bd)"><b style="color:var(--hd)">Notifikasi</b><span class="sp"></span>${unr() ? '<button class="btn s l" onclick="mall()">Tandai semua dibaca</button>' : ""}</div>${
    v
      .slice(0, 3)
      .map((i) => {
        const m = MSG[i],
          rd = RD["m" + i];
        return `<div class="mrow" data-m="${i}">${av(m[0], 38)}<div style="min-width:0"><b style="color:var(--hd);font-weight:${rd ? 500 : 700}">${m[1]}</b><div class="mu">${m[0]} · ${m[3]}</div><div class="mu" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${m[2]}</div></div></div>`;
      })
      .join("") ||
    '<div class="mrow mu" style="cursor:default">Tidak ada notifikasi.</div>'
  }<a class="mrow" data-r="pesan" style="justify-content:center;border-top:1px solid var(--bd)">Lihat semua notifikasi</a>`;
}
function refreshNav() {
  const n = $("#nb"),
    m = $("#nm");
  if (!n || !m) return;
  const u = unr();
  n.textContent = u;
  n.style.display = u ? "grid" : "none";
  m.innerHTML = msgMenu();
}
function mall() {
  vis().forEach((i) => (RD["m" + i] = 1));
  render();
}
function mread() {
  RD["m" + msgOpen] = 1;
  render();
}
function mdel() {
  DEL["m" + msgOpen] = 1;
  render();
  toast("Notifikasi dihapus");
}
function nblk(id, icn, title, bc, list) {
  const un = list.filter((x) => !RD[x[x.length - 1]]).length;
  return `<div class="dd l" id="${id}"><button class="btn l">${ic(icn, 18)} ${title} ${un ? `<span class="badge ${bc}">${un}</span>` : ""}</button><div class="menu"><div class="row" style="padding:.8rem 1rem;border-bottom:1px solid var(--bd)"><b style="color:var(--hd)">${title}</b><span class="sp"></span>${un ? `<button class="btn s l" onclick="nall('${id}')">Tandai semua dibaca</button>` : ""}</div>${
    list.length
      ? list
          .map((x) => {
            const nid = x[x.length - 1],
              rd = RD[nid];
            return `<div class="mrow" style="cursor:default;align-items:center">${x.length == 5 ? `<div style="min-width:0"><b style="color:var(--hd);font-weight:${rd ? 500 : 700}">${x[0]}</b><div class="mu">${x[1]}</div></div><span class="sp"></span><span class="badge ${x[3]}">${x[2]}</span>` : `<span class="ic ${x[2]}">${ic(x[0])}</span><div style="font-weight:${rd ? 400 : 700};color:${rd ? "inherit" : "var(--hd)"}">${x[1]}</div><span class="sp"></span>`}<span style="display:flex">${rd ? "" : `<button class="ib" title="Tandai dibaca" aria-label="Tandai dibaca" onclick="nact('${nid}','read','${id}')">${ic("check", 16)}</button>`}<button class="ib" title="Hapus" aria-label="Hapus" onclick="nact('${nid}','del','${id}')">${ic("trash", 16)}</button></span></div>`;
          })
          .join("")
      : '<div class="mrow mu" style="cursor:default">Tidak ada data.</div>'
  }</div></div>`;
}
function nopen(id) {
  const e = document.getElementById(id);
  if (e) e.classList.add("open");
}
function nact(nid, a, id) {
  if (a == "read") RD[nid] = 1;
  else DEL[nid] = 1;
  render();
  nopen(id);
}
function nall(id) {
  (id == "d4" ? DL : NOTIF).forEach(
    (_, i) => (RD[(id == "d4" ? "t" : "a") + i] = 1),
  );
  render();
  nopen(id);
}
