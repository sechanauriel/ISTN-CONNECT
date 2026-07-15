import os
import time
import subprocess
from playwright.sync_api import sync_playwright

def main():
    os.makedirs('docs/images', exist_ok=True)
    
    print("Starting FastAPI backend...")
    backend_process = subprocess.Popen(
        ['.\\.venv\\Scripts\\python.exe', '-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '8000'],
        cwd=os.path.abspath('.')
    )
    
    time.sleep(3) # Wait for backend to be ready
    
    frontend_path = "file:///" + os.path.abspath('frontend/index.html').replace('\\', '/')
    print(f"Opening frontend at {frontend_path}")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1366, "height": 768})
            
            # 1. Login Page
            page.goto(frontend_path)
            page.wait_for_load_state("networkidle")
            time.sleep(2)
            page.screenshot(path='docs/images/login.png')
            print("Captured login.png")
            
            # 2. Login as Mahasiswa using Quick Login
            page.evaluate('document.querySelector("button[data-quick-role=\\"Mahasiswa\\"]").click()')
            time.sleep(3)
            
            # Dashboard
            page.screenshot(path='docs/images/dashboard.png')
            print("Captured dashboard.png")
            
            # 3. Kartu Ujian (Mahasiswa role)
            try:
                page.evaluate('window.renderPage("exam-card")')
                time.sleep(3)
                page.screenshot(path='docs/images/kartu_ujian.png')
                print("Captured kartu_ujian.png")
            except Exception as e:
                print(f"Could not switch to Kartu Ujian: {e}")
                
            # Logout
            try:
                page.evaluate('document.querySelector("[data-action=logout]").click()')
                time.sleep(2)
            except:
                pass
                
            # 4. Login as Admin using Quick Login
            page.evaluate('document.querySelector("button[data-quick-role=\\"Administrator\\"]").click()')
            time.sleep(3)

            # 5. Event Monitor (Admin role)
            try:
                page.evaluate('window.renderPage("event-monitor")')
                time.sleep(3)
                page.screenshot(path='docs/images/event_monitor.png')
                print("Captured event_monitor.png")
            except Exception as e:
                print(f"Could not switch to Event Monitor: {e}")
            
            browser.close()
    finally:
        print("Terminating backend...")
        backend_process.terminate()

if __name__ == "__main__":
    main()
