# Three.js vendor files

Versi yang digunakan: `0.128.0`.

- `three.min.js`: `https://unpkg.com/three@0.128.0/build/three.min.js`
- `GLTFLoader.js`: `https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js`
- `DRACOLoader.js`: `https://unpkg.com/three@0.128.0/examples/js/loaders/DRACOLoader.js`
- Decoder Draco: `https://unpkg.com/three@0.128.0/examples/js/libs/draco/`
- Lisensi upstream: MIT, `https://github.com/mrdoob/three.js/blob/r128/LICENSE`

SHA-256 saat diunduh:

- `three.min.js`: `9274BBCEC8D96168626C732B5D31C775AA8CFB7EAA0599BEC0C175908A2C1CE2`
- `GLTFLoader.js`: `5C15967BA830918A9CAEA6338712C994C354BCCD4EDC4569BDE411C3EC06A3E6`
- `DRACOLoader.js`: `BBD4A1BB08F05D9C8DF1B411644A1FC31A32FDCD36489E5BCDFE6C4FA2B8E4E9`
- `draco_decoder.js`: `11798DA0910B6FA2DE7B85C48FF8512DEBF5E766B6BF29B6F66ADCEC94D04D1B`
- `draco_wasm_wrapper.js`: `172082724384A06E30A97760835A1723F14AC31B6B5CECB4A5AC82B1DEAE121A`
- `draco_decoder.wasm`: `92322D1CABAA55C8E216C983E58670043B063AF59D86A7B6AE8201452FF7987F`

File disimpan lokal agar Hero 3D tetap berjalan tanpa ketergantungan CDN saat runtime. Runtime Three.js dan loader dimuat setelah initial render melalui `src/scripts/three-runtime.js`.
