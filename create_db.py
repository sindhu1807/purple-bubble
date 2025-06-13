import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

# Drop old table if it exists
c.execute('DROP TABLE IF EXISTS products')

# Create fresh table with correct structure
c.execute('''
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT
)
''')

conn.commit()
conn.close()

print("✅ Fresh 'products' table created successfully!")
