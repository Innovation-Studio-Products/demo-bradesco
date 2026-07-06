# POC Tiago - Bradesco 🚀
### Angular 21 + FastAPI (Python) + SQLite

Este repositório contém uma Prova de Conceito (POC) de autenticação e gerenciamento de usuários desenvolvida para demonstrar uma integração limpa entre um frontend moderno em **Angular 21** e um backend robusto em **FastAPI (Python)**, utilizando **SQLite** como banco de dados embarcado.

A estrutura foi projetada para ser simples, auto-contida e fácil de rodar localmente com um único comando.

---

## 📂 Estrutura do Projeto

O workspace é dividido em duas partes principais conectadas por um inicializador inteligente na raiz:

```text
POC-TIAGO/
├── backend/               # Servidor API FastAPI
│   ├── main.py            # Endpoints e inicialização do app FastAPI
│   ├── database.py        # Configurações do banco SQLite e seed inicial
│   ├── requirements.txt   # Dependências Python
│   ├── users.db           # Arquivo do banco de dados SQLite (gerado automaticamente)
│   └── .venv/             # Ambiente virtual Python
├── frontend/              # Interface do usuário em Angular 21
│   ├── src/               # Componentes, serviços e páginas Angular
│   ├── package.json       # Dependências Node.js
│   └── angular.json       # Configurações do Angular CLI
├── run.py                 # Script unificado para rodar Backend e Frontend em paralelo
└── README.md              # Este arquivo de documentação
```

---

## 🛠️ Requisitos Prévios

Certifique-se de possuir instalado em sua máquina:
- **Python 3.10+** (para o backend)
- **Node.js 18+** e **npm** (para o frontend)

---

## 🚀 Como Executar o Projeto de Forma Rápida

Para facilitar o desenvolvimento, fornecemos um script unificado em Python (`run.py`) que inicializa tanto o backend quanto o frontend em processos separados e exibe as informações agregadas em seu terminal.

1. **Abra o terminal na raiz do projeto** (`POC-TIAGO`).
2. **Execute o inicializador**:
   ```bash
   python run.py
   ```
3. O script irá:
   - Iniciar o **Backend FastAPI** na porta `8000` (`http://127.0.0.1:8000`)
   - Iniciar o servidor de desenvolvimento do **Angular** na porta `4200` (`http://localhost:4200`)
   - Monitorar a execução de ambos. Para parar tudo de forma limpa, basta digitar `CTRL + C` no terminal.

---

## 🔧 Execução Manual (Passo a Passo)

Caso prefira iniciar cada módulo separadamente em abas distintas do terminal:

### 1. Inicializando o Backend
```bash
# Acesse o diretório do backend
cd backend

# Ative o ambiente virtual (se necessário)
# No macOS/Linux:
source .venv/bin/activate
# No Windows:
.venv\Scripts\activate

# Instale as dependências (se for a primeira execução)
pip install -r requirements.txt

# Execute com Uvicorn
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
* O backend estará disponível em `http://127.0.0.1:8000`
* Documentação interativa Swagger (OpenAPI) disponível em `http://127.0.0.1:8000/docs`

### 2. Inicializando o Frontend
```bash
# Acesse o diretório do frontend
cd frontend

# Instale os pacotes (se for a primeira execução)
npm install

# Execute o servidor Angular
npm run start
```
* O frontend estará disponível em `http://localhost:4200`

---

## 🛡️ Funcionalidades da POC

- **Tela de Login**: Validação e autenticação de usuários contra a base SQLite.
- **Tela de Registro**: Cadastro de novos usuários com validação básica no backend.
- **Armazenamento Seguro**: Persistência simples utilizando SQLite.
- **Geração de Token**: Retorno de um token de autenticação simulado (Bearer) para controle de sessão.
- **Tratamento de CORS**: Configurado para aceitar requisições vindas do frontend local.

---

## 💻 Tecnologias Utilizadas

- **Frontend**:
  - Angular 21 (última versão)
  - TypeScript
  - TailwindCSS / Estilização Customizada
  - RxJS (Programação reativa)
- **Backend**:
  - Python 3
  - FastAPI (Framework de altíssima performance)
  - SQLite (Banco leve e local)
  - Uvicorn (Servidor ASGI)
  - Pydantic (Validação e tipagem de dados)
