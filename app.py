from flask import Flask, render_template,request,jsonify,session, redirect, url_for, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, logout_user,login_required,current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Length, InputRequired, ValidationError, EqualTo
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_socketio import SocketIO, emit
from Ai import Chat

from pypdf import PdfReader
from ebooklib import epub
from io import BytesIO
from pypdf import PdfReader
from docx import Document
from io import BytesIO
from flask_cors import CORS, cross_origin
import tempfile
import os

from functools import wraps

app = Flask(__name__)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

socket = SocketIO(app)

"""The database """

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'thisisasecretkey'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

app.config['SESSION_TYPE'] = 'SQLAlchemy'
app.config['SESSION_SQLALCHEMY'] = db
app.config.from_object(__name__)
Session(app)


    #The tables 
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable = False, unique = True)
    password = db.Column(db.String(500), nullable = False)
    provided_input = db.Column(db.Boolean(), nullable = False, default = False)


    #The forms
class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], 
                           render_kw={"placeholder":'Username'})
    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20), EqualTo('confirm', message="Passwords must match")],
                            render_kw={"placeholder": "Password"})
    confirm = PasswordField(validators=[InputRequired(), Length(min=4,max=20)],
                            render_kw={"placeholder":"Repeat password"})
    submit = SubmitField('Sign up')

    def validate_username(self, username):
        extract_username = User.query.filter_by(
            username=username.data
        ).first()

        if extract_username:
            raise ValidationError("Username already exists, please choose a different one.")
        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], 
                           render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20)],
                             render_kw={"placeholder": "Password"})
    submit = SubmitField("Log in")

""""""

""" Helper functions """

#Search a file
def getFileText(username):
    file = open(f'./books/BookOf{username}.txt', 'r')
    text = file.read()
    file.close()
    return text

#Save text to file
def writeTextToFile(username, text):
    file = open(f'./books/BookOf{username}.txt', 'a')
    file.write(text)
    file.close()

#Save initial text
def writeInitialText(username,text):
    file = open(f'./books/BookOf{username}.txt', 'w')
    if len(text) != 0:
        text = removeWhiteSpace(text)
    file.write(text)
    file.close()

def removeWhiteSpace(text):
    textM = ""
    for i in range(len(text) - 1):
        if text[i] == " " and text[i+1] == " ":
            continue
        textM = textM + text[i]
    textM = textM + text[len(text) - 1]
    return textM

    
""""""

""" Helper decorator """

def input_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.provided_input == False:
            return redirect(url_for('index', message='Please provide the initial text'))  # Redirect to input page
        return func(*args, **kwargs)
    return wrapper

def setSettings(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'settings' not in session:
            session['settings'] = {
                "Theme": 0,
                "Font": 1,
                "Background": 1
            }
            return func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper


""""""

chat = Chat()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

""" The endpoints """
@app.route('/',methods = ['GET', 'POST'])
@login_required
@setSettings
def index():
    message = request.args.get('message')
    res = make_response(render_template('index.html', blocked=message))
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res

@app.route('/Book',methods = ['GET', 'POST'])
@login_required
@input_required
@setSettings
def book():
    return render_template('book.html')

@app.route('/getPlots',methods=['GET'])
@login_required
@input_required
@setSettings
def getPlots():
    
    #If the user has no plots in the session to be developed
    if 'plots' not in session or len(session['plots']) == 0:
        #Getting the user's info
        username = current_user.username
        text = getFileText(username)

        #Getting the plots
        plots = chat.get_plots(text)
        session['plots'] = plots

        #Testing
        #plots = ["1. **The Interrupted Reader:**","The story ends abruptly, leaving the reader to wonder if the protagonist is killed or manages to escape. The plot could follow the immediate aftermath of the encounter, focusing on the protagonist's struggle for survival and his attempts to understand how his life became intertwined with the novel he was reading.","","1. **The Interrupted Reader:**","The story ends abruptly, leaving the reader to wonder if the protagonist is killed or manages to escape. The plot could follow the immediate aftermath of the encounter, focusing on the protagonist's struggle for survival and his attempts to understand how his life became intertwined with the novel he was reading.","","1. **The Interrupted Reader:**","The story ends abruptly, leaving the reader to wonder if the protagonist is killed or manages to escape. The plot could follow the immediate aftermath of the encounter, focusing on the protagonist's struggle for survival and his attempts to understand how his life became intertwined with the novel he was reading.","","1. **The Interrupted Reader:**","The story ends abruptly, leaving the reader to wonder if the protagonist is killed or manages to escape. The plot could follow the immediate aftermath of the encounter, focusing on the protagonist's struggle for survival and his attempts to understand how his life became intertwined with the novel he was reading.","","1. **The Interrupted Reader:**","The story ends abruptly, leaving the reader to wonder if the protagonist is killed or manages to escape. The plot could follow the immediate aftermath of the encounter, focusing on the protagonist's struggle for survival and his attempts to understand how his life became intertwined with the novel he was reading."]

        return jsonify({'plots': plots})
        
    #If the user's session already has undeveloped plots
    plots = session['plots']
    return jsonify({'plots': plots})
    # return jsonify({'plots' : ["The guy walks out or something there and then pursues to do something else","", "The guy did nothing he just stood over there without saying anything"]})
    

@app.route('/develop', methods=['POST'])
@login_required
@input_required
@setSettings
def developPlot():

    #Getting the choice
    data = request.json
    choice = int(data['choice'])

    #Getting the current user info
    username = current_user.username
    text = getFileText(username)

    #Getting the developement of the text
    developement = chat.developPlot(session['plots'][choice],text)
    writeTextToFile(username, developement)

    #Clearing the session
    session['plots'] = []

    return jsonify({
        'text': developement
    })
    
@app.route('/getTitle', methods=['POST'])
@login_required
@input_required
@setSettings
def getTitle():
    data = request.json
    plot = data["plot"]
    if plot == "":
        plot = getFileText(current_user.username)
    text = chat.getTitle(plot)
    return jsonify({
        'title': text
    })

@app.route('/uiSettings', methods=['GET','POST'])
@setSettings
def Settings():
    if request.method == 'GET':
        res = jsonify(session['settings'])
        res.headers.add('Access-Control-Allow-Origin', '*')
        return res
    else :
        session['settings'] = request.json
        return jsonify({
            "success":True
        })


@app.route("/initial", methods=["GET"])
@login_required
@input_required
@setSettings
def initial():
    #Getting user's info
    username = current_user.username
    text = getFileText(username)

    return jsonify({'text':text})

@app.route('/reset', methods=['GET'])
@login_required
@setSettings
def reset():
    try:
        if 'plots' in session:
            session['plots'] = []
        current_user.provided_input = False
        writeInitialText(current_user.username, '')
        return jsonify({
            'status' : 'Successful'
        })
    except Exception as error:
        return jsonify({
            'status': f'Error {error}'
        })

""""""

""" Authentication """

@app.route('/login', methods=['GET', 'POST'])
@setSettings
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username = form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password,form.password.data):
                login_user(user)
                return redirect(url_for('index'))
            else:
                return render_template('login.html', errors = {'password':'Wrong password'}, form=form)
        else:
            return render_template('login.html',errors = {'username': 'Username not found'}, form=form)
    return render_template('login.html', form=form)

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
@setSettings
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        Username = form.username.data
        pw = form.password.data
        password = bcrypt.generate_password_hash(pw)
        new_user = User(username=Username,password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html',errors =form.errors ,form=form)

""""""

""" The app's socket """

@socket.on('upload_json')
@login_required
def TextInput(data):
    try:
        #Getting input
        text = data["text"]
        print(text)
        #Saving input to the specific user entry
        writeInitialText(current_user.username, text)

        #Anouncing that input has alreday been taken
        current_user.provided_input = True
        db.session.commit()

        #Responding
        emit('upload_successful')

    except Exception as error:
        emit('upload_error', f"Error processing file: {str(error)}")

@socket.on('upload_pdf')
@login_required
def PdfInput(data):
    try:
        #Getting user info
        username = current_user.username

        #Getting the input text
        pdf = PdfReader(BytesIO(data))
        text = ""
        for page in pdf.pages:
            text = text + page.extract_text()

        #Saving input to specific entry
        writeInitialText(username, text)

        #Anouncing that input has alreday been taken
        current_user.provided_input = True
        db.session.commit()

        #Responding
        emit('upload_successful')

    except Exception as error:
        emit('upload_error',f"Error processing file: {str(error)}")

@socket.on('upload_word')
@login_required
def TextInput(data):
    try:
        #Getting input
        dataArr = bytearray(data)
        doc = Document(dataArr)
        text = ""
        for p in doc.paragraphs:
            text = text + p.text

        #Saving text to specific user
        writeInitialText(current_user.username, text)

        #Giving access to the book
        current_user.provided_input = True
        db.session.commit()

        #Responding
        emit('uplod_successful')

    except Exception as error:
        emit('upload_error',f"Error processing file: {str(error)}")

@socket.on('upload_txt')
@login_required
def TextInput(data):
    print('wssssssl')
    try:
        #Getting input
        text = data.decode('utf-8') #TODO must find a way to decode a file regardless of it's encoding (aka: find the encoding of the file and use it to decode)

        #Saving text to specific user
        writeInitialText(current_user.username, text)

        #Giving access to the book
        current_user.provided_input = True
        db.session.commit()


        #Responding
        emit('upload_successful')

    except Exception as error:
        emit('upload_error', f"Error processing file: {str(error)}")

""""""


if __name__ == '__main__':
    app.run(debug=False)