from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from database import init_db, get_db_connection

app = FastAPI(
    title="POC Login Backend",
    description="Backend Python limpo em FastAPI com SQLite para a POC de Login",
    version="1.0.0"
)

# Permitir CORS para o frontend Angular (normalmente roda na porta 4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar o banco de dados no startup
@app.on_event("startup")
def on_startup():
    init_db()

# Modelos do Pydantic para validação de entrada
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str

# Endpoints do app
@app.get("/")
def read_root():
    return {"message": "API de Autenticação da POC está online!", "docs": "/docs"}

@app.post("/api/login")
def login(request: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, username, full_name, password FROM users WHERE username = ?", 
        (request.username,)
    )
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )
        
    # Verificação de senha em texto plano (simples para a POC)
    if user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )
        
    # Login de sucesso, gera um token simples de mock
    token = f"mock-token-jwt-for-{user['username']}-xyz123"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"]
        }
    }

@app.post("/api/register")
def register(request: RegisterRequest):
    if not request.username or not request.password or not request.full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todos os campos são obrigatórios."
        )
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar se usuário já existe
    cursor.execute("SELECT id FROM users WHERE username = ?", (request.username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nome de usuário já cadastrado."
        )
        
    try:
        cursor.execute(
            "INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)",
            (request.username, request.password, request.full_name)
        )
        conn.commit()
    except sqlite3.Error as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro no banco de dados: {str(e)}"
        )
        
    conn.close()
    return {"message": "Usuário registrado com sucesso!", "username": request.username}
