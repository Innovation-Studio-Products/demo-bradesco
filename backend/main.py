from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Backend Base",
    description="Backend Python limpo em FastAPI",
    version="1.0.0"
)

# Permitir CORS para o frontend Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API está online!"}


@app.get("/api/recorrencias")
def get_recorrencias():
    """
    Retorna uma lista mockada de autorizações de Pix Automático.
    """
    return [
        {"id": 1, "beneficiario": "Empresa A", "valor": 100.00, "status": "ativa", "proximaCobranca": "2026-08-01", "periodicidade": "Mensal", "dataPausa": None},
        {"id": 2, "beneficiario": "Empresa B", "valor": 50.00, "status": "pausada", "proximaCobranca": "2026-08-15", "periodicidade": "Quinzenal", "dataPausa": "2026-07-01"},
        {"id": 3, "beneficiario": "Empresa C", "valor": 75.00, "status": "pendente_aprovacao", "proximaCobranca": "2026-08-10", "periodicidade": "Mensal", "dataPausa": None}
    ]


@app.post("/api/recorrencias/{recorrencia_id}/approve")
def approve_recorrencia(recorrencia_id: int):
    print(f"Aprovando recorrência ID: {recorrencia_id}")
    return {"status": "success", "action": "approved", "id": recorrencia_id}

@app.post("/api/recorrencias/{recorrencia_id}/pause")
def pause_recorrencia(recorrencia_id: int):
    print(f"Pausando recorrência ID: {recorrencia_id}")
    return {"status": "success", "action": "paused", "id": recorrencia_id}

@app.post("/api/recorrencias/{recorrencia_id}/cancel")
def cancel_recorrencia(recorrencia_id: int):
    print(f"Cancelando recorrência ID: {recorrencia_id}")
    return {"status": "success", "action": "canceled", "id": recorrencia_id}


