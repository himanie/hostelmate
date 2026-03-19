from app.extensions import db
from datetime import datetime

class Messmenu(db.Model):
    __tablename__ = "mess_menu"

    id = db.Column(db.Integer , primary_key = True)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.id"), nullable = False)
    day = db.Column(db.String(20), nullable = False)
    meal_type = db.Column(db.String(20), nullable= False)
    item = db.Column(db.String(200), nullable =  False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    week_start_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
