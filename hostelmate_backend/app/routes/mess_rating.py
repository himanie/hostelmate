from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.hostel import Hostels
from werkzeug.utils import secure_filename
from app.models.mess_rating import MessRating
from datetime import datetime, date, timedelta
import cloudinary.uploader

mess_bp = Blueprint("mess_ratings", __name__)

@mess_bp.route("/api/ratings/<int:hostel_id>", methods=["GET"])
@jwt_required()
def get_ratings(hostel_id):

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    query = db.session.query(MessRating, User).join(
        User, User.id == MessRating.user_id
    ).filter(
        MessRating.hostel_id == hostel_id
    )

    pagination = query.order_by(
        MessRating.created_at.desc()
    ).paginate(page=page, per_page=limit, error_out=False)

    ratings = []

    for rating, user in pagination.items:
        ratings.append({
            "id": rating.id,
            "rating": rating.rating,
            "comment": rating.comment,
            "meal_type": rating.meal_type,
            "photo_url": rating.photo_url,
            "date": str(rating.date),

            "user_name": user.name,
            "user_email": user.email
        })

    return jsonify({
        "ratings": ratings,
        "total": pagination.total
    })

@mess_bp.route("/api/today/<int:hostel_id>", methods=["GET"])
def today_ratings(hostel_id):

    today = date.today()

    ratings = MessRating.query.filter(
        MessRating.hostel_id == hostel_id,
        func.date(MessRating.created_at) == today
    ).all()

    return jsonify({
        "ratings":[r.to_dict() for r in ratings]
    })


@mess_bp.route("/api/stats/<int:hostel_id>", methods=["GET"])
def rating_stats(hostel_id):

    avg_rating = db.session.query(
        func.avg(MessRating.rating)
    ).filter(
        MessRating.hostel_id == hostel_id
    ).scalar()

    total = MessRating.query.filter_by(hostel_id=hostel_id).count()

    return jsonify({
        "total_ratings": total,
        "average_rating": float(avg_rating or 0)
    })


@mess_bp.route("/api/submit", methods=["POST"])
@jwt_required()
def submit_rating():
    try:
        user_id = get_jwt_identity()

        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error":"user not found"}),404
        
        if not user.hostel_id:
            return jsonify({"error":"User is not assigned to any hostel"}),400

        hostel_id = user.hostel_id
        meal_type = request.form.get("meal_type")
        rating_value = request.form.get("rating")
        comment = request.form.get("comment")

        photo = request.files.get("photo")

        image_url = None

        if photo:
            result = cloudinary.uploader.upload(photo)
            image_url = result.get("secure_url")

      
        rating = MessRating(
            user_id=user_id,
            hostel_id=hostel_id,
            meal_type=meal_type,
            rating=rating_value,
            comment=comment,
            photo_url=image_url,
            date=date.today(),
            created_at=datetime.utcnow()
        )

        print("user_id:", user_id)
        print("hostel_id:", hostel_id)
        print("meal_type:", meal_type)
        print("rating:", rating_value)
        print("comment:", comment)
        print("photo:", photo)
       

        db.session.add(rating)
        db.session.commit()

        return jsonify({
            "message": "Rating submitted successfully",
            "image_url": image_url
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mess_bp.route("/api/weekly", methods=["GET"])
def weekly_ratings():

    hostel_id = request.args.get("hostel_id")

    today = datetime.utcnow().date()
    last_week = today - timedelta(days=6)

    ratings = MessRating.query.filter(
        MessRating.hostel_id == hostel_id,
        func.date(MessRating.created_at) >= last_week,
        func.date(MessRating.created_at) <= today
    ).all()

    return jsonify({
        "ratings": [r.to_dict() for r in ratings]
    })