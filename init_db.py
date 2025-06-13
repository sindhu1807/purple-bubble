import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

c.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT
    )
''')

conn.commit()
conn.close()

print("✅ products table created successfully.")
