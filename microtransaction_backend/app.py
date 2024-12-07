from flask import Flask, request, jsonify, session
from flask_cors import CORS
import tenseal as ts

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.secret_key = "super_secret_key"

user_balances = {}  
user_passwords = {} 

def create_context():
    context = ts.context(ts.SCHEME_TYPE.CKKS, poly_modulus_degree=8192, coeff_mod_bit_sizes=[60, 40, 40, 60])
    context.global_scale = 2**40
    context.generate_galois_keys()
    context.generate_relin_keys()
    return context

context = create_context()

@app.route('/create_user', methods=['POST'])
def create_user():
    user_id = request.json.get('user_id')
    password = request.json.get('password')
    initial_balance = float(request.json.get('initial_balance', 100))

    if user_id in user_balances:
        return jsonify({'error': 'Kullanıcı zaten mevcut'}), 400

    encrypted_balance = ts.ckks_vector(context, [initial_balance])
    user_balances[user_id] = encrypted_balance
    user_passwords[user_id] = password

    return jsonify({'message': 'Kullanıcı oluşturuldu'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    user_id = request.json.get('user_id')
    password = request.json.get('password')

    if user_id not in user_passwords or user_passwords[user_id] != password:
        return jsonify({'error': 'Hatalı kullanıcı adı veya şifre'}), 401

    session['user_id'] = user_id
    print(session)
    return jsonify({'message': 'Başarıyla giriş yapıldı!'}), 200

@app.route('/update_balance', methods=['POST'])
def update_balance():
    if 'user_id' not in session:
        return jsonify({'error': 'Giriş yapılmadı'}), 403

    user_id = session['user_id']
    transaction_amount = float(request.json.get('transaction_amount'))

    if user_id not in user_balances:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    encrypted_balance = user_balances[user_id]
    encrypted_transaction = ts.ckks_vector(context, [transaction_amount])
    encrypted_balance += encrypted_transaction
    user_balances[user_id] = encrypted_balance

    return jsonify({'message': 'Bakiye güncellendi'}), 200

@app.route('/get_balance', methods=['GET'])
def get_balance():
    if 'user_id' not in session:
        print(session)
        return jsonify({'error': 'Giriş yapılmadı'}), 403

    user_id = session['user_id']

    if user_id not in user_balances:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    encrypted_balance = user_balances[user_id]
    decrypted_balance = encrypted_balance.decrypt(context.secret_key())

    rounded_balance = round(decrypted_balance[0], 2)

    return jsonify({'decrypted_balance': rounded_balance}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Çıkış yapıldı'}), 200

if __name__ == '__main__':
    app.run(debug=True)
