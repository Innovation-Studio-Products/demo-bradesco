import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Criar tabela de usuários
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL
        )
    """)
    
    # Inserir usuário mock padrão se a tabela estiver vazia
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    
    if count == 0:
        cursor.execute("""
            INSERT INTO users (username, password, full_name)
            VALUES (?, ?, ?)
        """, ("admin", "admin123", "Administrador do Sistema"))
        conn.commit()
        print("Banco de dados inicializado com o usuário padrão 'admin' (senha: 'admin123')!")
    else:
        print("Banco de dados já existente e populado.")
        
    conn.close()

if __name__ == "__main__":
    init_db()
