from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import settings
from app.workers.scheduler import start_scheduler, stop_scheduler


from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import hash_password

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables for SQLite development
    Base.metadata.create_all(bind=engine)
    
    # Seed demo user
    with SessionLocal() as db:
        demo_email = "demo@company.com"
        if not db.query(User).filter(User.email == demo_email).first():
            demo_user = User(
                email=demo_email,
                full_name="Demo User",
                hashed_password=hash_password("demo1234"),
                email_verified=True,
                otp_resend_count=0,
            )
            db.add(demo_user)
            db.commit()

    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="HR Interview Assistant", version="0.2.0", docs_url="/docs", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
