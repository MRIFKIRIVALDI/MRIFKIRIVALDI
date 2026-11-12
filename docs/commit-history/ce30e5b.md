# Commit ce30e5b

Menjadikan dist sebagai output sementara, menambahkan clean script, dan menjaga root hanya memiliki satu src serta satu index.html.

## Identitas

| Field | Nilai |
| --- | --- |
| SHA lengkap | `ce30e5b8534fa9fed0cd2a8a019c8c7bf163fc98` |
| Tanggal | 2026-11-12T10:50:20+07:00 |
| Author | MRIFKIRIVALDI <rifki.rivaldi_ti23@nusaputra.ac.id> |
| Pesan asli | Update Site source |
| Statistik | 7 files changed, 48 insertions(+), 15 deletions(-) |

## File yang berubah

| Status | Path |
| --- | --- |
| `M` | `README.md` |
| `M` | `docs/architecture.md` |
| `M` | `docs/audit-report.md` |
| `M` | `package.json` |
| `M` | `scripts/check.mjs` |
| `A` | `scripts/clean.mjs` |
| `M` | `scripts/dev.mjs` |

## Periksa versi ini

```powershell
git show --stat ce30e5b8534fa9fed0cd2a8a019c8c7bf163fc98
git switch --detach ce30e5b8534fa9fed0cd2a8a019c8c7bf163fc98
```

Kembali ke branch utama:

```powershell
git switch main
```

## Pulihkan project ke versi ini tanpa menghapus riwayat

Pastikan working tree bersih, lalu jalankan:

```powershell
git restore --source=ce30e5b8534fa9fed0cd2a8a019c8c7bf163fc98 --staged --worktree .
git commit -m "revert: restore project to ce30e5b"
git push origin main
```

Setelah rollback, lakukan validasi dan publikasi ulang agar website aktif memakai commit pemulihan baru. Hindari `git reset --hard` dan force-push kecuali benar-benar memahami dampaknya.
