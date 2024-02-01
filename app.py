from flask import Flask, render_template, redirect, url_for, send_from_directory, request

app = Flask(__name__, static_folder='static')


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template('admin.html')

@app.route('/professor', methods=['GET', 'POST'])
def professor():
    return render_template('professor.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    return render_template('dashboard.html')

@app.route('/viewer', methods=['GET'])
def viewer():
    return render_template('viewer.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
