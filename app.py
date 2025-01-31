from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(_name_)

# Database Configuration
DB_USER = "postgres"
DB_PASSWORD = "postgres"
DB_HOST = "localhost"  # or the IP where your Docker container is running
DB_PORT = "5432"      # default PostgreSQL port
DB_NAME = "postgres"

# SQLAlchemy configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Models
class Policyholder(db.Model):
    _tablename_ = 'policyholder'
    
    policyholder_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(255), nullable=False)
    policies = db.relationship('Policy', backref='policyholder', lazy=True, cascade="all, delete-orphan")

class Policy(db.Model):
    _tablename_ = 'policy'
    
    policy_id = db.Column(db.String(50), primary_key=True)
    policy_type = db.Column(db.String(100), nullable=False)
    coverage_amount = db.Column(db.Numeric(12, 2), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    policyholder_id = db.Column(db.String(50), db.ForeignKey('policyholder.policyholder_id'), nullable=False)
    claims = db.relationship('Claim', backref='policy', lazy=True, cascade="all, delete-orphan")

class Claim(db.Model):
    _tablename_ = 'claim'
    
    claim_id = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    policy_id = db.Column(db.String(50), db.ForeignKey('policy.policy_id'), nullable=False)

# Root endpoint
@app.route('/')
def home():
    return "Claims Management System API"

# Policyholder endpoints
@app.route('/policyholders', methods=['POST'])
def create_policyholder():
    data = request.get_json()
    try:
        ph = Policyholder(
            policyholder_id=data['policyholder_id'],
            name=data['name'],
            contact_info=data['contact_info']
        )
        db.session.add(ph)
        db.session.commit()
        return jsonify({
            'policyholder_id': ph.policyholder_id,
            'name': ph.name,
            'contact_info': ph.contact_info
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/policyholders/<policyholder_id>', methods=['GET'])
def get_policyholder(policyholder_id):
    ph = Policyholder.query.get_or_404(policyholder_id)
    return jsonify({
        'policyholder_id': ph.policyholder_id,
        'name': ph.name,
        'contact_info': ph.contact_info
    }), 200

@app.route('/policyholders/<policyholder_id>', methods=['PUT'])
def update_policyholder(policyholder_id):
    ph = Policyholder.query.get_or_404(policyholder_id)
    data = request.get_json()
    try:
        if 'name' in data:
            ph.name = data['name']
        if 'contact_info' in data:
            ph.contact_info = data['contact_info']
        db.session.commit()
        return jsonify({
            'policyholder_id': ph.policyholder_id,
            'name': ph.name,
            'contact_info': ph.contact_info
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/policyholders/<policyholder_id>', methods=['DELETE'])
def delete_policyholder(policyholder_id):
    ph = Policyholder.query.get_or_404(policyholder_id)
    try:
        db.session.delete(ph)
        db.session.commit()
        return jsonify({"message": "Policyholder deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Policy endpoints
@app.route('/policies', methods=['POST'])
def create_policy():
    data = request.get_json()
    try:
        policy = Policy(
            policy_id=data['policy_id'],
            policy_type=data['policy_type'],
            coverage_amount=data['coverage_amount'],
            start_date=datetime.strptime(data['start_date'], "%Y-%m-%d").date(),
            end_date=datetime.strptime(data['end_date'], "%Y-%m-%d").date(),
            policyholder_id=data['policyholder_id']
        )
        db.session.add(policy)
        db.session.commit()
        return jsonify({
            'policy_id': policy.policy_id,
            'policy_type': policy.policy_type,
            'coverage_amount': float(policy.coverage_amount),
            'start_date': str(policy.start_date),
            'end_date': str(policy.end_date),
            'policyholder_id': policy.policyholder_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/policies/<policy_id>', methods=['GET'])
def get_policy(policy_id):
    policy = Policy.query.get_or_404(policy_id)
    return jsonify({
        'policy_id': policy.policy_id,
        'policy_type': policy.policy_type,
        'coverage_amount': float(policy.coverage_amount),
        'start_date': str(policy.start_date),
        'end_date': str(policy.end_date),
        'policyholder_id': policy.policyholder_id
    }), 200

@app.route('/policies', methods=['GET'])
def get_all_policies():
    policies = Policy.query.all()
    return jsonify([{
        'policy_id': p.policy_id,
        'policy_type': p.policy_type,
        'coverage_amount': float(p.coverage_amount),
        'start_date': str(p.start_date),
        'end_date': str(p.end_date),
        'policyholder_id': p.policyholder_id
    } for p in policies]), 200

@app.route('/policies/<policy_id>', methods=['PUT'])
def update_policy(policy_id):
    policy = Policy.query.get_or_404(policy_id)
    data = request.get_json()
    try:
        if 'policy_type' in data:
            policy.policy_type = data['policy_type']
        if 'coverage_amount' in data:
            policy.coverage_amount = data['coverage_amount']
        if 'start_date' in data:
            policy.start_date = datetime.strptime(data['start_date'], "%Y-%m-%d").date()
        if 'end_date' in data:
            policy.end_date = datetime.strptime(data['end_date'], "%Y-%m-%d").date()
        
        db.session.commit()
        return jsonify({
            'policy_id': policy.policy_id,
            'policy_type': policy.policy_type,
            'coverage_amount': float(policy.coverage_amount),
            'start_date': str(policy.start_date),
            'end_date': str(policy.end_date),
            'policyholder_id': policy.policyholder_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/policies/<policy_id>', methods=['DELETE'])
def delete_policy(policy_id):
    policy = Policy.query.get_or_404(policy_id)
    try:
        db.session.delete(policy)
        db.session.commit()
        return jsonify({"message": "Policy deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Claim endpoints
@app.route('/claims', methods=['POST'])
def create_claim():
    data = request.get_json()
    try:
        claim = Claim(
            claim_id=data['claim_id'],
            description=data['description'],
            amount=data['amount'],
            date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
            status=data.get('status', 'Pending'),
            policy_id=data['policy_id']
        )
        db.session.add(claim)
        db.session.commit()
        return jsonify({
            'claim_id': claim.claim_id,
            'description': claim.description,
            'amount': float(claim.amount),
            'date': str(claim.date),
            'status': claim.status,
            'policy_id': claim.policy_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/claims/<claim_id>', methods=['GET'])
def get_claim(claim_id):
    claim = Claim.query.get_or_404(claim_id)
    return jsonify({
        'claim_id': claim.claim_id,
        'description': claim.description,
        'amount': float(claim.amount),
        'date': str(claim.date),
        'status': claim.status,
        'policy_id': claim.policy_id
    }), 200

@app.route('/claims/<claim_id>', methods=['PUT'])
def update_claim(claim_id):
    claim = Claim.query.get_or_404(claim_id)
    data = request.get_json()
    try:
        if 'description' in data:
            claim.description = data['description']
        if 'amount' in data:
            claim.amount = data['amount']
        if 'date' in data:
            claim.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
        if 'status' in data:
            claim.status = data['status']
        
        db.session.commit()
        return jsonify({
            'claim_id': claim.claim_id,
            'description': claim.description,
            'amount': float(claim.amount),
            'date': str(claim.date),
            'status': claim.status,
            'policy_id': claim.policy_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/claims/<claim_id>', methods=['DELETE'])
def delete_claim(claim_id):
    claim = Claim.query.get_or_404(claim_id)
    try:
        db.session.delete(claim)
        db.session.commit()
        return jsonify({"message": "Claim deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if _name_ == '_main_':
    # Create all database tables
    with app.app_context():
        db.create_all()
    app.run(debug=True)