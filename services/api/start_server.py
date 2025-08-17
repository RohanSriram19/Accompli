#!/usr/bin/env python3
"""
Startup script for the Accompli API development server.
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    """Start the development server."""
    print("🚀 Starting Accompli API development server...")
    
    # Check if we're in the right directory
    api_dir = Path(__file__).parent
    os.chdir(api_dir)
    
    # Check if database needs initialization
    print("\n📋 Checking database status...")
    try:
        # Try to import and test database connection
        from app.database import engine
        from sqlmodel import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
    except Exception as e:
        print(f"⚠️  Database connection failed: {e}")
        print("💡 You may need to run database initialization:")
        print("   python init_db.py")
        
        response = input("\nContinue anyway? (y/n): ").lower().strip()
        if response not in ['y', 'yes']:
            print("Exiting...")
            return
    
    # Start the server
    print("\n🌟 Starting FastAPI server...")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("🛑 Press Ctrl+C to stop\n")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app",
            "--reload",
            "--host", "0.0.0.0",
            "--port", "8000"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
