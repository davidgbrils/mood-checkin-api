```md
# Mood Check-In API

API backend untuk fitur **"Mood Check-In"** pada platform mental health-tech.  
Menyimpan, mengelola, dan menampilkan riwayat mood harian pengguna.

---

## Arsitektur Singkat & Flow Request-Response

```
Client (Web/Mobile)
        ↓ POST /mood
Express → Joi Validation → API Key Middleware → Mongoose → MongoDB Atlas
        ↑ 201 Created
```

- **Request** → Validasi input → Cek `x-api-key` → Simpan ke DB
- **Response** → JSON dengan data mood + status

---

## Deskripsi Endpoint dan Contoh Payload

### 1. `POST /mood` — Simpan laporan mood harian
```http
POST http://localhost:3000/mood
Headers:
  Content-Type: application/json
  x-api-key: ecall
```
**Body:**
```json
{
  "user_id": "user123",
  "mood_score": 4,
  "mood_label": "Senang",
  "notes": "Hari ini produktif dan cerah!"
}
```
**Response (201 Created):**
```json
{
    "user_id": "user123",
    "mood_score": 4,
    "mood_label": "Senang",
    "notes": "Hari ini cerah dan produktif!",
    "_id": "69008822137d65fb81eccb50",
    "date": "2025-10-28T09:08:50.268Z",
    "__v": 0
}
```

---

### 2. `GET /mood/:user_id` — Riwayat mood per pengguna
```http
GET http://localhost:3000/mood/user123
Header: x-api-key: ecall
```
**Response (200 OK):**
```json
[
    {
        "_id": "69008822137d65fb81eccb50",
        "user_id": "user123",
        "mood_score": 4,
        "mood_label": "Senang",
        "notes": "Hari ini cerah dan produktif!",
        "date": "2025-10-28T09:08:50.268Z",
        "__v": 0
    }
]
```

---

### 3. `GET /summary/:user_id` *(opsional)* — Rata-rata mood per minggu/bulan
```http
GET http://localhost:3000/mood/summary/user123
Header: x-api-key: ecall
```
**Response:**
```json
[
    {
        "_id": {
            "year": 2025,
            "month": 10,
            "week": 43
        },
        "averageMood": 4,
        "count": 1
    }
]
```

---

## Pertimbangan Keamanan & Skalabilitas

| Aspek | Implementasi |
|------|--------------|
| **Keamanan Data** | MongoDB Atlas (enkripsi at rest & in transit) |
| **Akses API** | `x-api-key` wajib → 401 jika salah/tidak ada |
| **Validasi Input** | Joi → `mood_score` (1–5), `user_id` required |
| **Skalabilitas** | Indexing `{ user_id: 1, date: -1 }` → query cepat |
| **Kapasitas** | MongoDB Atlas auto-scale → **bisa 50.000 entri/hari** tanpa degradasi |
| **Integrasi AI** | Data terstruktur → mudah di-query untuk rekomendasi |

---

## Alasan Teknis di Balik Setiap Keputusan Desain

| Keputusan | Alasan |
|---------|--------|
| **MongoDB Atlas (NoSQL)** | Fleksibel untuk `notes` (text panjang), write-heavy, skalabel, tanpa server lokal |
| **Express + Node.js** | Ringan, cepat, standar industri untuk REST API |
| **Mongoose** | Schema + indexing + validasi otomatis |
| **Joi** | Validasi input ketat, cegah injection & data rusak |
| **API Key (`x-api-key`)** | Sederhana, aman untuk MVP, mudah diintegrasikan |
| **Aggregation di DB** | Hitung rata-rata langsung di MongoDB → hemat CPU server |

---

## Setup & Cara Menjalankan

```bash
git clone https://github.com/username/mood-checkin-api.git
cd mood-checkin-api
npm install
```

**Edit `.env`:**
```env
MONGO_URI=mongodb+srv://breaklimited12_db_user:IMpzed4c1JXctWVo@mood-checkin.rns19e3.mongodb.net/?appName=mood-checkin
API_KEY=ecall
PORT=3000
```

**Jalankan:**
```bash
npm start
```

Server berjalan di: `http://localhost:3000`

---
