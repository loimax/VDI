from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

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

@app.route('/student', methods=['GET', 'POST'])
def student():
    return render_template('student.html')

if __name__ == '__main__':
    app.run(debug=True)
