import subprocess
import sys
import os
import time
import signal

def run_poc():
    print("=" * 60)
    print("        INICIALIZADOR DA POC - ANGULAR 21 + FASTAPI/SQLITE")
    print("=" * 60)
    
    processes = []
    
    # Obter os caminhos absolutos
    base_dir = os.path.abspath(os.path.dirname(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")
    
    # 1. Iniciar o Backend FastAPI
    print("\n[1/2] Iniciando o Backend Python (FastAPI + SQLite)...")
    
    # Definir o interpretador Python do ambiente virtual
    if sys.platform == "win32":
        python_exe = os.path.join(backend_dir, ".venv", "Scripts", "python.exe")
        uvicorn_exe = os.path.join(backend_dir, ".venv", "Scripts", "uvicorn.exe")
    else:
        python_exe = os.path.join(backend_dir, ".venv", "bin", "python")
        uvicorn_exe = os.path.join(backend_dir, ".venv", "bin", "uvicorn")
        
    if not os.path.exists(python_exe):
        print(f"❌ Erro: Ambiente virtual Python não encontrado em: {python_exe}")
        print("Tente recriar o ambiente virtual na pasta backend.")
        sys.exit(1)
        
    try:
        # Comando para rodar o uvicorn no diretório do backend
        backend_process = subprocess.Popen(
            [uvicorn_exe, "main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(backend_process)
        print("🟢 Backend iniciado e rodando em: http://127.0.0.1:8000")
        print("   Documentação interativa disponível em: http://127.0.0.1:8000/docs")
    except Exception as e:
        print(f"❌ Erro ao iniciar o backend: {e}")
        sys.exit(1)
        
    # 2. Iniciar o Frontend Angular
    print("\n[2/2] Iniciando o Frontend Angular 21 (ng serve)...")
    try:
        # No macOS/Linux, npx está disponível diretamente na maioria dos ambientes com Node instalado.
        # Usamos o script start do package.json para rodar o ng serve na porta 4200
        frontend_process = subprocess.Popen(
            ["npm", "run", "start", "--", "--port", "4200", "--open=false"],
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(frontend_process)
        print("🟢 Frontend iniciado com sucesso!")
        print("   Acesse a aplicação no navegador em: http://localhost:4200")
    except Exception as e:
        print(f"❌ Erro ao iniciar o frontend: {e}")
        # Finaliza o backend se o frontend falhar
        backend_process.terminate()
        sys.exit(1)
        
    print("\n" + "=" * 60)
    print(" Ambas as aplicações estão sendo executadas em segundo plano.")
    print(" Pressione CTRL+C a qualquer momento para encerrar de forma limpa.")
    print("=" * 60 + "\n")
    
    # Função para lidar com o encerramento limpo (CTRL+C)
    def signal_handler(sig, frame):
        print("\n\nEncerramento solicitado. Finalizando subprocessos de forma limpa...")
        for proc in processes:
            try:
                if sys.platform == "win32":
                    proc.send_signal(signal.CTRL_C_EVENT)
                else:
                    proc.terminate()
                proc.wait(timeout=3)
            except Exception:
                proc.kill()
        print("✨ Todos os processos foram encerrados. Até logo!")
        sys.exit(0)
        
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Se for execução de teste, espera 5 segundos para ver se sobem e encerra com sucesso
    if "--test" in sys.argv:
        print("\n🔍 Modo de teste detectado (--test). Aguardando 5 segundos para verificar integridade dos processos...")
        time.sleep(5)
        
        backend_ok = backend_process.poll() is None
        frontend_ok = frontend_process.poll() is None
        
        if backend_ok and frontend_ok:
            print("✅ TESTE BEM SUCEDIDO: Ambos os processos iniciaram corretamente e estão rodando!")
            signal_handler(None, None)
        else:
            if not backend_ok:
                print("❌ TESTE FALHOU: O processo do Backend parou de responder.")
            if not frontend_ok:
                print("❌ TESTE FALHOU: O processo do Frontend parou de responder.")
            
            # Força o encerramento de qualquer processo sobrevivente
            for proc in processes:
                try:
                    proc.kill()
                except Exception:
                    pass
            sys.exit(1)

    # Loop de monitoramento que imprime os logs mesclados
    while True:
        # Monitora a saída do backend
        if backend_process.poll() is not None:
            print("🚨 Processo do Backend encerrou inesperadamente!")
            break
        if frontend_process.poll() is not None:
            print("🚨 Processo do Frontend encerrou inesperadamente!")
            break
            
        # Lê uma linha de log para não bloquear (podemos deixar apenas rodando em background)
        time.sleep(1)


if __name__ == "__main__":
    run_poc()
