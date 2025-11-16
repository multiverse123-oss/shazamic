const pool = require('../config/database');

class Song {
  static async create(songData) {
    const { title, artist, album, duration, release_date, genre, cover_art_url } = songData;
    
    const query = `
      INSERT INTO songs (title, artist, album, duration, release_date, genre, cover_art_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [title, artist, album, duration, release_date, genre, cover_art_url];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating song: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM songs WHERE id = $1';
    const values = [id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding song: ${error.message}`);
    }
  }

  static async findByTitleAndArtist(title, artist) {
    const query = 'SELECT * FROM songs WHERE title ILIKE $1 AND artist ILIKE $2';
    const values = [`%${title}%`, `%${artist}%`];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding song: ${error.message}`);
    }
  }

  static async findAll(limit = 10, offset = 0) {
    const query = 'SELECT * FROM songs ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const values = [limit, offset];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching songs: ${error.message}`);
    }
  }

  static async search(queryString, limit = 10) {
    const query = `
      SELECT * FROM songs 
      WHERE title ILIKE $1 OR artist ILIKE $1 OR album ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const values = [`%${queryString}%`, limit];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error searching songs: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    values.push(id);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const query = `UPDATE songs SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating song: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM songs WHERE id = $1 RETURNING *';
    const values = [id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting song: ${error.message}`);
    }
  }
}

module.exports = Song;
```

### models/Fingerprint.js
```javascript
const pool = require('../config/database');

class Fingerprint {
  static async create(fingerprintData) {
    const { song_id, fingerprint, duration } = fingerprintData;
    
    const query = `
      INSERT INTO fingerprints (song_id, fingerprint, duration)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [song_id, fingerprint, duration];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating fingerprint: ${error.message}`);
    }
  }

  static async findBySongId(songId) {
    const query = 'SELECT * FROM fingerprints WHERE song_id = $1';
    const values = [songId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding fingerprint: ${error.message}`);
    }
  }

  static async findByFingerprint(fingerprint) {
    const query = 'SELECT * FROM fingerprints WHERE fingerprint = $1';
    const values = [fingerprint];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding fingerprint: ${error.message}`);
    }
  }

  static async searchBySimilarity(fingerprint, threshold = 0.7) {
    // In a real implementation, we'd use a more sophisticated similarity algorithm
    // This is a simplified version for demonstration
    const query = `
      SELECT f.*, s.title, s.artist, s.album, s.duration
      FROM fingerprints f
      JOIN songs s ON f.song_id = s.id
      WHERE f.fingerprint <-> $1 < (1 - $2)
      ORDER BY f.fingerprint <-> $1 ASC
      LIMIT 10
    `;
    
    const values = [fingerprint, threshold];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error searching fingerprints: ${error.message}`);
    }
  }
}

module.exports = Fingerprint;
```
