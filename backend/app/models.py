from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Instantiate a clean database model token
db = SQLAlchemy()

class Receipt(db.Model):
    __tablename__ = 'receipts'
    
    id = db.Column(db.Integer, primary_key=True)
    raw_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Clean linkage to the menu items
    items = db.relationship('MenuItem', backref='receipt', lazy=True, cascade="all, delete-orphan")

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    receipt_id = db.Column(db.Integer, db.ForeignKey('receipts.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    unit_price = db.Column(db.Float, default=0.0, nullable=False)
    gluten_free = db.Column(db.Boolean, default=False, nullable=False)