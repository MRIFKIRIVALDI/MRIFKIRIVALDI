# Commit cffaa41

docs: add SHA-based rollback history

## Identitas

| Field | Nilai |
| --- | --- |
| SHA lengkap | `cffaa415963336414cabe94f88a2360c4952bada` |
| Tanggal | 2026-11-12T16:04:03+07:00 |
| Author | MRIFKIRIVALDI <rifki.rivaldi_ti23@nusaputra.ac.id> |
| Pesan asli | docs: add SHA-based rollback history |
| Statistik | 15 files changed, 753 insertions(+), 3 deletions(-) |

## File yang berubah

| Status | Path |
| --- | --- |
| `M` | `README.md` |
| `A` | `docs/commit-history/59da806.md` |
| `A` | `docs/commit-history/6b8bfe3.md` |
| `A` | `docs/commit-history/71ea21b.md` |
| `A` | `docs/commit-history/8487712.md` |
| `A` | `docs/commit-history/871172f.md` |
| `A` | `docs/commit-history/README.md` |
| `A` | `docs/commit-history/c81f906.md` |
| `A` | `docs/commit-history/ce30e5b.md` |
| `A` | `docs/commit-history/d99804c.md` |
| `A` | `docs/commit-history/fa0ee91.md` |
| `A` | `docs/commit-history/fbf37b6.md` |
| `M` | `package.json` |
| `M` | `scripts/check.mjs` |
| `A` | `scripts/update-commit-history.mjs` |

## Periksa versi ini

```powershell
git show --stat cffaa415963336414cabe94f88a2360c4952bada
git switch --detach cffaa415963336414cabe94f88a2360c4952bada
```

Kembali ke branch utama:

```powershell
git switch main
```

## Pulihkan project ke versi ini tanpa menghapus riwayat

Pastikan working tree bersih, lalu jalankan:

```powershell
git restore --source=cffaa415963336414cabe94f88a2360c4952bada --staged --worktree .
git commit -m "revert: restore project to cffaa41"
git push origin main
```

Setelah rollback, lakukan validasi dan publikasi ulang agar website aktif memakai commit pemulihan baru. Hindari `git reset --hard` dan force-push kecuali benar-benar memahami dampaknya.
