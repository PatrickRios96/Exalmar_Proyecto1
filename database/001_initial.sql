CREATE TABLE IF NOT EXISTS reports (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL,
 type TEXT NOT NULL, product TEXT NOT NULL, lot TEXT NOT NULL DEFAULT '', presentation TEXT NOT NULL DEFAULT '',
 purchase_date TEXT NOT NULL DEFAULT '', description TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Recibido',
 response TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS reports_user_date ON reports(user_id,created_at);
CREATE TABLE IF NOT EXISTS catalog (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL,
 details TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, failures INTEGER NOT NULL DEFAULT 0, window_start INTEGER NOT NULL);
