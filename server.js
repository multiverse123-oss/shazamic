javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const songRoutes = require('./routes/songs');
const fingerprintRoutes = require('./routes/fingerprints');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/songs', songRoutes);
app.use('/api/fingerprints', fingerprintRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shazam Clone Backend API',
    endpoints: {
      songs: '/api/songs',
      fingerprints: '/api/fingerprints'
    }
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
```

### Database Schema (SQL)

```sql
-- Create database
CREATE DATABASE shazam_db;

-- Connect to database
\c shazam_db;

-- Create songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  duration INTEGER NOT NULL,
  release_date DATE,
  genre VARCHAR(100),
  cover_art_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fingerprints table
CREATE TABLE fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  fingerprint BYTEA NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_songs_title_artist ON songs(title, artist);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX idx_fingerprints_song_id ON fingerprints(song_id);
CREATE INDEX idx_fingerprints_fingerprint ON fingerprints(fingerprint);

-- Enable pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for trigram search
CREATE INDEX idx_songs_trgm ON songs USING gin ((title || ' ' || artist) gin_trgm_ops);
