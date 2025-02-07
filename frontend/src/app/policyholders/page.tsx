
"use client";

import React, { useState, useEffect } from 'react';

const PolicyholderCRUD = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('read');
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    policyholder_id: ''
  });

  const handleOperation = async (op) => {
    setOperation(op);
    setLoading(true);

    let response;
    const baseUrl = 'http://localhost:5000/policyholders';
    
    switch (op) {
      case 'create':
        response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        break;
      case 'read':
        response = await fetch(searchId ? `${baseUrl}/${searchId}` : baseUrl);
        break;
      case 'update':
        response = await fetch(`${baseUrl}/${searchId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        break;
      case 'delete':
        response = await fetch(`${baseUrl}/${searchId}`, {
          method: 'DELETE',
        });
        break;
      default:
        throw new Error('Invalid operation');
    }

    if (op !== 'delete') {
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
    } else {
      setData([{ message: 'Policyholder deleted successfully' }]);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">
        {/* ID Search Field */}
        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">Policyholder ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter policyholder ID"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
            />
            <button
              onClick={() => handleOperation(operation)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enter
            </button>
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setOperation('create')}
            className={`px-4 py-2 rounded-lg ${
              operation === 'create'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setOperation('read')}
            className={`px-4 py-2 rounded-lg ${
              operation === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setOperation('update')}
            className={`px-4 py-2 rounded-lg ${
              operation === 'update'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            }`}
          >
            Update
          </button>
          <button
            onClick={() => setOperation('delete')}
            className={`px-4 py-2 rounded-lg ${
              operation === 'delete'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            Delete
          </button>
        </div>

        {/* Form for Create/Update */}
        {(operation === 'create' || operation === 'update') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {operation === 'create' ? 'Create New Policyholder' : 'Update Policyholder'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Contact Info</label>
                <input
                  type="email"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {operation === 'create' && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Policyholder ID</label>
                  <input
                    type="text"
                    name="policyholder_id"
                    value={formData.policyholder_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display Data */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {operation === 'delete' ? 'Operation Result' : 'Policyholder Details'}
                </h1>
                {operation !== 'delete' && (
                  <p className="text-sm text-gray-500">ID: {data[0].policyholder_id}</p>
                )}
              </div>
              
              {operation === 'delete' ? (
                <p className="text-gray-900">{data[0].message}</p>
              ) : (
                <div className="space-y-4">
                  {data.map((item, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg text-gray-900">{item.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Info</p>
                        <p className="text-gray-900">
                          <a 
                            href={`mailto:${item.contact_info}`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {item.contact_info}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Policyholder ID</p>
                        <p className="text-lg text-gray-900">{item.policyholder_id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyholderCRUD;
