# Commit 6b8bfe3

Mengubah Hero menjadi layout tiga bagian dan menambahkan robot astronot interaktif berbasis Three.js.

## Identitas

| Field | Nilai |
| --- | --- |
| SHA lengkap | `6b8bfe3ba90ffbc61d4a20796f12963e1f014aae` |
| Tanggal | 2026-11-11T11:10:10+07:00 |
| Author | MRIFKIRIVALDI <rifki.rivaldi_ti23@nusaputra.ac.id> |
| Pesan asli | Update Site source |
| Statistik | 6 files changed, 585 insertions(+), 116 deletions(-) |

## File yang berubah

| Status | Path |
| --- | --- |
| `M` | `README.md` |
| `M` | `index.html` |
| `A` | `src/scripts/hero-robot.js` |
| `M` | `src/scripts/main.js` |
| `M` | `src/styles/responsive.css` |
| `M` | `src/styles/sections.css` |

## Periksa versi ini

```powershell
git show --stat 6b8bfe3ba90ffbc61d4a20796f12963e1f014aae
git switch --detach 6b8bfe3ba90ffbc61d4a20796f12963e1f014aae
```

Kembali ke branch utama:

```powershell
git switch main
```

## Pulihkan project ke versi ini tanpa menghapus riwayat

Pastikan working tree bersih, lalu jalankan:

```powershell
git restore --source=6b8bfe3ba90ffbc61d4a20796f12963e1f014aae --staged --worktree .
git commit -m "revert: restore project to 6b8bfe3"
git push origin main
```

Setelah rollback, lakukan validasi dan publikasi ulang agar website aktif memakai commit pemulihan baru. Hindari `git reset --hard` dan force-push kecuali benar-benar memahami dampaknya.
