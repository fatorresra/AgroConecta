# pylint: disable=missing-function-docstring
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from application.service.auth_service import AuthService
from adapters.output.unique_ider.uuid_ider import UUIDIder
from adapters.output.password_hasher.argon2_cffi_hasher import Argon2CffiHasher
from adapters.output.user_repository.local_db import LocalDBUserRepository
from adapters.output.jwt_handler.jwt_handler import JWTHandler

import requests
import os

auth_blueprint = Blueprint('auth', __name__)

auth_service = AuthService(
    repo=LocalDBUserRepository(),
    hasher=Argon2CffiHasher(),
    unique_ider=UUIDIder(),
    token_handler=JWTHandler()
)

# Función manual por ahora para verificar reCAPTCHA
def verify_recaptcha(token):
    secret = os.getenv("RECAPTCHA_SECRET_KEY")
    response = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": secret, "response": token},
        timeout=5
    )
    result = response.json()
    print(f"reCAPTCHA verification result: {result}")
    return result.get("success", False)

@auth_blueprint.route('/register', methods=['POST'])
@swag_from("docs/register_user.yaml")
def register_user():
    data = request.get_json()

    if data is None:
        return {"error": "Invalid or missing JSON body"}, 400

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role')
    recaptcha_token = data.get('recaptcha')

    if not email or not password or not name or not role:
        return jsonify({"error": "Missing required fields"}), 400

    if not recaptcha_token or not verify_recaptcha(recaptcha_token):
        return jsonify({"error": "Invalid reCAPTCHA"}), 400

    try: 
        user = auth_service.register_user(email, password, name, role)
        return jsonify(user.public_to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
@auth_blueprint.route('/login', methods=['POST'])
@swag_from("docs/login.yaml")
def login_user():
    data = request.get_json()

    if data is None:
        return {"error": "Invalid or missing JSON body"}, 400

    email = data.get('email')
    password = data.get('password')
    recaptcha_token = data.get('recaptcha')

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if not recaptcha_token or not verify_recaptcha(recaptcha_token):
        return jsonify({"error": "Invalid reCAPTCHA"}), 400

    try:
        user = auth_service.login_user(email, password)
        token = auth_service.token_handler.generate_token(
            {"user_id": user.id, "email": user.email, "role": user.role}
        )
        data = {}
        data["user"] = user.public_to_dict()
        data["token"] = token
        return jsonify(data), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    

@auth_blueprint.route('/validate-token', methods=['GET'])
@swag_from("docs/validate_token.yaml")
def validate_token():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Missing Authorization header"}), 401
    
    if not token.startswith("Bearer "):
        return jsonify({"error": "Invalid Authorization header format"}), 401
    
    token = token.split(" ")[1]

    try:
        payload = auth_service.token_handler.verify_token(token)
        email = payload.get("email")
        if not email:
            return jsonify({"error": "Invalid token payload"}), 401
        
        user = auth_service.repo.get_user_by_email(email)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"valid": True, "user_id": user.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Get a user by ID
@auth_blueprint.route('/users/<user_id>', methods=['GET'])
@swag_from("docs/get_user.yaml")
def get_user(user_id):
    try:
        user = auth_service.repo.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.public_to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Delete the entire user database
# Only for testing purposes
@auth_blueprint.route('/__test__/database', methods=['DELETE'])
@swag_from("docs/delete_database.yaml")
def delete_database():
    APP_ENV = os.getenv('APP_ENV', 'development')

    if APP_ENV != 'test':
        return jsonify({"error": "This endpoint is only available in test environment"}), 403
    
    try:
        auth_service.repo.delete_database()
        return jsonify({"message": "Database deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500