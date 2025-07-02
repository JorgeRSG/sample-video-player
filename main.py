# Copyright 2025 Google LLC

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

# https://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, render_template

# Create a Flask web application instance.
# The 'template_folder' argument tells Flask to look for templates
# in a directory named 'templates' in the same directory as this script.
# The 'static_folder' argument does the same for static files like CSS and JS.
app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def home():
    """
    Handles requests to the homepage ('/').
    Instead of rendering a string, it now renders the 'index.html' file
    located in the 'templates' directory.
    """
    return render_template('index.html')

if __name__ == "__main__":
    """
    This block runs the Flask application when the script is executed directly.
    - debug=True enables auto-reloading on code changes and provides detailed error pages.
    - host='0.0.0.0' makes the server accessible from other devices on your network.
    
    For a production environment, you should use a more robust WSGI server
    like Gunicorn or Waitress instead of Flask's built-in development server.
    """
    app.run(host='0.0.0.0', port=5000, debug=True)
