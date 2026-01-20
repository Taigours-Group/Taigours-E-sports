
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 🛡️ TAIGOUR'S E-SPORTS - POWER CORE (SERVER)
 * Configured for Local JSON and Cloud Supabase Persistence
 */

// Supabase Configuration (Using provided keys)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mttqhwvgihtlceefnskz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHFod3ZnaWh0bGNlZWZuc2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU0Nzk1NywiZXhwIjoyMDg0MTIzOTU3fQ.XZRudVg6SlOlN6PCwZey6C7TmxFOBy6ar5whKULVOLU';

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('📡 [Database] Supabase Cloud Driver: CONNECTED');
  }
} catch (e) {
  console.warn('⚠️ [Database] Supabase driver missing. Run: npm install @supabase/supabase-js');
}

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const DB_DIR = path.join(__dirname, 'db');

// --- Helper Functions ---
async function readJson(file) {
  try {
    const filePath = path.join(DB_DIR, file);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function writeJson(file, data) {
  const filePath = path.join(DB_DIR, file);
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const ENTITIES = {
  tournaments: 'tournaments.json',
  leaderboard: 'leaderboard.json',
  streams: 'streams.json',
  registrations: 'registrations.json'
};

// --- API Endpoints ---

// 1. Unified Dashboard Fetch
app.get('/api/data', async (req, res) => {
  try {
    const data = {};
    
    // Try Supabase first if active
    if (supabase) {
      for (const table of Object.keys(ENTITIES)) {
        const { data: dbData, error } = await supabase.from(table).select('*');
        if (!error) {
          data[table] = dbData;
          // Sync local cache
          await writeJson(ENTITIES[table], dbData);
        } else {
          // If table doesn't exist yet or error, use local
          data[table] = await readJson(ENTITIES[table]);
        }
      }
    } else {
      // Offline / Local Mode
      for (const [key, file] of Object.entries(ENTITIES)) {
        data[key] = await readJson(file);
      }
    }
    
    res.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'System processing failed' });
  }
});

// 2. Dynamic Resource Handlers
Object.entries(ENTITIES).forEach(([key, filename]) => {
  
  // GET List
  app.get(`/api/${key}`, async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from(key).select('*');
      if (!error) return res.json(data);
    }
    res.json(await readJson(filename));
  });

  // POST (Insert or Update Collection)
  app.post(`/api/${key}`, async (req, res) => {
    try {
      const payload = req.body;
      
      // Update Local
      await writeJson(filename, payload);
      
      // Update Supabase (Bulk Upsert)
      if (supabase) {
        // We assume 'id' is the primary key
        const { error } = await supabase.from(key).upsert(payload, { onConflict: 'id' });
        if (error) console.error(`Supabase Upsert Error [${key}]:`, error.message);
      }
      
      res.status(200).json({ status: 'Synchronized', entity: key });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE Specific Item
  app.delete(`/api/${key}/:id`, async (req, res) => {
    const { id } = req.params;
    try {
      // Local Delete
      let data = await readJson(filename);
      data = data.filter(item => item.id !== id);
      await writeJson(filename, data);
      
      // Supabase Delete
      if (supabase) {
        const { error } = await supabase.from(key).delete().eq('id', id);
        if (error) console.error(`Supabase Delete Error [${key}]:`, error.message);
      }
      
      res.status(200).json({ message: `Record ${id} purged` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`
  🚀 TAIGOUR'S CORE ACTIVE
  -------------------------
  📡 Port:      ${PORT}
  Address:   http://localhost:${PORT}
  🛠️  Supabase:  ${supabase ? 'ACTIVE' : 'OFFLINE'}
  📂 Storage:   ${DB_DIR}
  -------------------------
  READY FOR BATTLE.
  `);
});
