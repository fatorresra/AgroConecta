from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from adapters.input.auth.auth_controller import auth_blueprint
from dotenv import load_dotenv
import os
from prometheus_flask_exporter import PrometheusMetrics


# Load environment variables from .env file
load_dotenv(override=True)

app = Flask(__name__)

# Initialize Prometheus metrics
metrics = PrometheusMetrics.for_app_factory()

CORS(app, resources={r"/auth/*": {
    "origins": ["*"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Initialize Swagger for API documentation
swagger = Swagger(app)

app.register_blueprint(auth_blueprint, url_prefix='/auth')

metrics.init_app(app)

if __name__ == "__main__":
    print("=== Endpoints registrados ===")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint:30s} {rule.methods} {rule.rule}")

    # Set debug mode based on environment variable
    debug_mode = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'

    # If the app is in debug mode, the prometheus metrics endpoint won't be available
    app.run(debug=False, host='0.0.0.0', port=5001)