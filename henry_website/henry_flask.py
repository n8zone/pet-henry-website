from flask import Flask, jsonify, render_template, request, make_response
import uuid
import sqlite3
import random
savedPatsFile = "number.txt"

adjectives = ["big", "long", "small", "golden", "yellow", "black", "red", "short", "cunning", "silly","radical","sluggish","speedy","humorous","shy","scared","brave","intelligent","stupid"]
nouns = ["Dog","Watermelon","Crusader","Lancer","Envisage","Frog","Beetle","Cellphone","Python","Lizard","Butterfly","Dragon","Automobile","Cow","Henry","Levi","Array","Buzzer","Balloon"]

def read_number():
    try:
        with open('number.txt', "r") as file:
            return int(file.read())
    except FileNotFoundError:
        return 0

def write_number(number):
    with open(savedPatsFile, "w") as file:
        file.write(str(number))


number = read_number()
app = Flask(__name__)

def get_pet_count(user_id):
    conn = sqlite3.connect('henry.db')
    c = conn.cursor()
    c.execute("SELECT count FROM pets WHERE user_id=?", (user_id,))
    count = c.fetchone()
    conn.close()
    return count[0] if count else 0

def assign_random_name():
    adj = random.choice(adjectives)
    noun = random.choice(nouns)
    digits = random.randint(1,999)
    if digits < 10:
        digitString = "00" + str(digits)
    elif digits < 100:
        digitString = "0" + str(digits)
    else:
        digitString = str(digits)

    newName = adj + noun + digitString
    return newName

def get_user_display_name(user_id):
    conn = sqlite3.connect('henry.db')
    c = conn.cursor()
    c.execute("SELECT display_name FROM pets WHERE user_id=?", (user_id,))
    name = c.fetchone()
    conn.close()
    
    
    if name is None or name[0] is None:
        displayName = assign_random_name()
        conn = sqlite3.connect('henry.db')
        c = conn.cursor()
        c.execute("UPDATE pets SET display_name = ? WHERE user_id = ?", (displayName, user_id))
        conn.commit()
        conn.close()
    else:
        displayName = name[0]
    return displayName

@app.route('/')
def index():
    user_ip = request.remote_addr

    user_id = request.cookies.get('user_id')
    if (user_id is None):
        print("No uuid!")
        user_id = str(uuid.uuid4()) # creates a new uuid for user
        conn = sqlite3.connect('henry.db')
        print(conn)
        print(user_id)
        c = conn.cursor()
        c.execute("INSERT INTO pets (user_id, count) VALUES (?, ?)", (user_id,0))
        conn.commit()
        conn.close()
    pet_count = get_pet_count(user_id)
    print(pet_count)
    display_name = get_user_display_name(user_id)
    resp = make_response(render_template("henry_index.html",henry_pic="/static/henry.jpeg", number=number,pet_count=pet_count, display_name=display_name))
    resp.set_cookie('user_id', user_id, max_age=60*60*24*365)
    resp.set_cookie('display_name', display_name)
    return resp

@app.route('/increment', methods = ['POST'])
def increment():
    global number
    number += 1
    write_number(number)
    user_id = request.cookies.get('user_id')
    conn = sqlite3.connect('henry.db')
    c = conn.cursor()
    c.execute("UPDATE pets SET count = count + 1 WHERE user_id=?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify(number=number)


@app.route('/get_user_pets')
def get_user_pets():
    user_id = request.cookies.get('user_id')
    conn = sqlite3.connect('henry.db')
    c = conn.cursor()
    c.execute("SELECT count FROM pets WHERE user_id=?", (user_id,))
    count = c.fetchone()
    conn.close()
    userCount = count[0] if count else 0
    return jsonify(userCount=userCount)

@app.route('/get_number')
def get_number():
    return jsonify(number=number)



@app.route('/get_leaderboard')
def get_top_petters():
    user_id = request.cookies.get('user_id')
    conn = sqlite3.connect('henry.db')
    c = conn.cursor()
    c.execute("SELECT count, display_name, DENSE_RANK() OVER (ORDER BY count DESC) AS rank FROM pets WHERE display_name IS NOT NULL ORDER BY count DESC LIMIT 10")
    raw_leaderboard = c.fetchall()
    leaderboard = [{'rank': rank, 'count': count, 'display_name' : display_name} for count, display_name, rank in raw_leaderboard]

    query = """
    WITH RankedPets AS (
        SELECT user_id, display_name, count,
            DENSE_RANK() OVER (ORDER BY count DESC) AS rank
        FROM pets
        WHERE display_name IS NOT NULL
    )
    SELECT rank, count, display_name FROM RankedPets WHERE user_id=?
    """

    c.execute(query, (user_id,))
    user_rank = c.fetchone()
    leaderboard.append({'rank': user_rank[0], 'count': user_rank[1], 'display_name' : user_rank[2]})
    
    conn.close()

    return jsonify(leaderboard)

#get_top_petters()
app.run(host="0.0.0.0", port=80)
