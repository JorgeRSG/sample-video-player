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
