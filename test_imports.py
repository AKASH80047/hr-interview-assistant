import sys
from pathlib import Path
sys.path.append(str(Path.cwd() / "backend"))

try:
    from app.main import app
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
