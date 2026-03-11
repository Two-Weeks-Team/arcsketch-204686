from fastapi import FastAPI, Request, HTMLResponse
from models import Base, engine
from routes import router

app = FastAPI()

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": "2026-03-10T16:10:00Z"}

@app.get("/")
async def root():
    content = """
    <html>
      <head>
        <title>ArcSketch API</title>
        <style>
          body { background: #1a1a1a; color: #ffffff; font-family: sans-serif; }
          h1 { color: #00ffcc; }
          a { color: #00ffcc; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <h1>ArcSketch API</h1>
        <p>Live collaborative sketch board for architects – sketch, sync, export.</p>
        <h2>Endpoints</h2>
        <ul>
          <li><strong>GET /health</strong> - Liveness probe</li>
          <li><strong>GET /</strong> - This page</li>
          <li><strong>POST /auth/register</strong> - Register a new user</li>
          <li><strong>POST /auth/login</strong> - Authenticate and receive JWT</li>
          <li><strong>POST /projects</strong> - Create a new sketch project</li>
          <li><strong>GET /projects</strong> - List projects the user can access</li>
          <li><strong>GET /projects/{project_id}</strong> - Retrieve project metadata</li>
          <li><strong>POST /projects/{project_id}/ai/snap</strong> - AI-Snap: convert strokes to vectors</li>
          <li><strong>POST /projects/{project_id}/ai/suggest</strong> - AI-Suggest: material recommendations</li>
          <li><strong>POST /projects/{project_id}/export</strong> - Export canvas to SVG/PDF/</li>
        </ul>
        <h2>Tech Stack</h2>
        <ul>
          <li>FastAPI (Python)</li>
          <li>PostgreSQL (SQLAlchemy)</li>
          <li>Serverless AI Inference</li>
        </ul>
        <p><a href="/docs">Swagger Docs</a> | <a href="/redoc">Redoc Docs</a></p>
      </body>
    </html>
    """
    return HTMLResponse(content=content)


@app.middleware("http")
async def normalize_api_prefix(request: Request, call_next):
    if request.scope.get("path", "").startswith("/api/"):
        request.scope["path"] = request.scope["path"][4:] or "/"
    return await call_next(request)

app.include_router(router)