from flask import Flask, request, jsonify
from manager import ClaimsManager
from entities import Policyholder, Policy, Claim
from datetime import datetime

app = Flask(__name__)
manager = ClaimsManager()

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
        manager.create_policyholder(ph)
        return jsonify(ph.__dict__), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/policyholders/<policyholder_id>', methods=['GET'])
def get_policyholder(policyholder_id):
    ph = manager.get_policyholder(policyholder_id)
    if ph:
        return jsonify(ph.__dict__), 200
    return jsonify({"error": "Policyholder not found"}), 404

@app.route('/policyholders/<policyholder_id>', methods=['PUT'])
def update_policyholder(policyholder_id):
    data = request.get_json()
    try:
        updates = {}
        if 'name' in data:
            updates['name'] = data['name']
        if 'contact_info' in data:
            updates['contact_info'] = data['contact_info']
        
        manager.update_policyholder(policyholder_id, **updates)
        return jsonify(manager.get_policyholder(policyholder_id).__dict__), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/policyholders/<policyholder_id>', methods=['DELETE'])
def delete_policyholder(policyholder_id):
    try:
        manager.delete_policyholder(policyholder_id)
        return jsonify({"message": "Policyholder deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Policy endpoints
@app.route('/policies', methods=['POST'])
def create_policy():
    data = request.get_json()
    try:
        policy = Policy(
            policy_id=data['policy_id'],
            policy_type=data['policy_type'],
            coverage_amount=float(data['coverage_amount']),
            start_date=datetime.strptime(data['start_date'], "%Y-%m-%d").date(),
            end_date=datetime.strptime(data['end_date'], "%Y-%m-%d").date(),
            policyholder_id=data['policyholder_id']
        )
        manager.create_policy(policy)
        return jsonify(policy.__dict__), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/policies/<policy_id>', methods=['GET'])
def get_policy(policy_id):
    policy = manager.get_policy(policy_id)
    if policy:
        return jsonify({
            "policy_id": policy.policy_id,
            "policy_type": policy.policy_type,
            "coverage_amount": policy.coverage_amount,
            "start_date": str(policy.start_date),
            "end_date": str(policy.end_date),
            "policyholder_id": policy.policyholder_id
        }), 200
    return jsonify({"error": "Policy not found"}), 404

@app.route('/policies', methods=['GET'])
def get_all_policies():
    policies = list(manager.policies.values())
    return jsonify([{
        "policy_id": p.policy_id,
        "policy_type": p.policy_type,
        "coverage_amount": p.coverage_amount,
        "start_date": str(p.start_date),
        "end_date": str(p.end_date),
        "policyholder_id": p.policyholder_id
    } for p in policies]), 200

@app.route('/policies/<policy_id>', methods=['PUT'])
def update_policy(policy_id):
    data = request.get_json()
    try:
        updates = {}
        if 'policy_type' in data:
            updates['policy_type'] = data['policy_type']
        if 'coverage_amount' in data:
            updates['coverage_amount'] = float(data['coverage_amount'])
        if 'start_date' in data:
            updates['start_date'] = datetime.strptime(data['start_date'], "%Y-%m-%d").date()
        if 'end_date' in data:
            updates['end_date'] = datetime.strptime(data['end_date'], "%Y-%m-%d").date()
        
        manager.update_policy(policy_id, **updates)
        return jsonify(manager.get_policy(policy_id).__dict__), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/policies/<policy_id>', methods=['DELETE'])
def delete_policy(policy_id):
    try:
        manager.delete_policy(policy_id)
        return jsonify({"message": "Policy deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Claim endpoints
@app.route('/claims', methods=['POST'])
def create_claim():
    data = request.get_json()
    try:
        claim = Claim(
            claim_id=data['claim_id'],
            description=data['description'],
            amount=float(data['amount']),
            date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
            status=data.get('status', 'Pending'),
            policy_id=data['policy_id']
        )
        manager.create_claim(claim)
        return jsonify(claim.__dict__), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/claims/<claim_id>', methods=['GET'])
def get_claim(claim_id):
    claim = manager.get_claim(claim_id)
    if claim:
        return jsonify({
            "claim_id": claim.claim_id,
            "description": claim.description,
            "amount": claim.amount,
            "date": str(claim.date),
            "status": claim.status,
            "policy_id": claim.policy_id
        }), 200
    return jsonify({"error": "Claim not found"}), 404

@app.route('/claims/<claim_id>', methods=['PUT'])
def update_claim(claim_id):
    data = request.get_json()
    try:
        updates = {}
        if 'description' in data:
            updates['description'] = data['description']
        if 'amount' in data:
            updates['amount'] = float(data['amount'])
        if 'date' in data:
            updates['date'] = datetime.strptime(data['date'], "%Y-%m-%d").date()
        if 'status' in data:
            updates['status'] = data['status']
        
        manager.update_claim(claim_id, **updates)
        return jsonify(manager.get_claim(claim_id).__dict__), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/claims/<claim_id>', methods=['DELETE'])
def delete_claim(claim_id):
    try:
        manager.delete_claim(claim_id)
        return jsonify({"message": "Claim deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)


