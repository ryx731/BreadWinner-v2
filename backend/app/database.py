from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Initialize database by creating all tables"""
    with app.app_context():
        db.create_all()

def reset_db(app):
    """Reset database - USE WITH CAUTION"""
    with app.app_context():
        db.drop_all()
        db.create_all()