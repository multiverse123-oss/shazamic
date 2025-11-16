javascript
const express = require('express');
const router = express.Router();
const SongController = require('../controllers/songController');

// GET /api/songs - Get all songs
router.get('/', SongController.getAllSongs);

// GET /api/songs/:id - Get song by ID
router.get('/:id', SongController.getSongById);

// POST /api/songs - Create a new song
router.post('/', SongController.createSong);

// GET /api/songs/search - Search songs
router.get('/search', SongController.searchSongs);

// PUT /api/songs/:id - Update a song
router.put('/:id', SongController.updateSong);

// DELETE /api/songs/:id - Delete a song
router.delete('/:id', SongController.deleteSong);

module.exports = router;
```

### routes/fingerprints.js
```javascript
const express = require('express');
const multer = require('multer');
const router = express.Router();
const FingerprintController = require('../controllers/fingerprintController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/fingerprints - Create a fingerprint
router.post('/', FingerprintController.createFingerprint);

// GET /api/fingerprints/song/:songId - Get fingerprint by song ID
router.get('/song/:songId', FingerprintController.getFingerprintBySongId);

// POST /api/fingerprints/search - Search by fingerprint
router.post('/search', FingerprintController.searchByFingerprint);

// POST /api/fingerprints/process - Process audio file
router.post('/process', upload.single('audio'), FingerprintController.processAudioFile);

module.exports = router;
