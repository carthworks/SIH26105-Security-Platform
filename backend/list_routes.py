from zenith_backend.main import app

for route in app.routes:
    try:
        methods = getattr(route, "methods", "N/A")
        print(f"Route: {route.path}, Methods: {methods}")
    except Exception as e:
        print(f"Route error: {e}")