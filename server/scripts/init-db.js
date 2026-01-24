const fs = require('fs');
const path = require('path');
const db = require('../database/db');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon (assuming simple splitting works for this schema)
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        for (const query of queries) {
            await db.query(query);
            console.log('Executed:', query.substring(0, 50) + '...');
        }

        console.log('✅ Database tables initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
        process.exit(1);
    }
}

initDb();
