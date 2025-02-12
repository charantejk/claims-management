"use client";

import React, { useState } from "react";

interface ClaimData {
  claim_id: string;
  description: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  policy_id: string;
}

const ClaimCRUD: React.FC = () => {
  // Change data state to hold an array of claims.
  const [data, setData] = useState<ClaimData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"create" | "read" | "update" | "delete">("read");
  const [searchId, setSearchId] = useState("");
  const [formData, setFormData] = useState<ClaimData>({
    claim_id: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    policy_id: "",
  });

  const validStatuses = ["Pending", "Approved", "Rejected"];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleOperation = async (op: "create" | "read" | "update" | "delete") => {
    setLoading(true);
    let response;
    const baseUrl = "https://renderbackend-3d5c.onrender.com/claims";

    if (op === "create") {
      response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else if (op === "read") {
      // If searchId is empty, fetch all claims.
      if (searchId.trim() === "") {
        response = await fetch(baseUrl);
      } else {
        response = await fetch(`${baseUrl}/${searchId}`);
      }
    } else if (op === "update") {
      response = await fetch(`${baseUrl}/${searchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else if (op === "delete") {
      response = await fetch(`${baseUrl}/${searchId}`, {
        method: "DELETE",
      });
    }

    if (op !== "delete") {
      if (op === "create") {
        // Validate formData before proceeding
        if (!formData.claim_id || !formData.description || !formData.amount || !formData.date || !formData.status || !formData.policy_id) {
          alert("All fields are required for creating a claim.");
          setLoading(false);
          return;
        }
      }
      const result = await response?.json();
      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([result]);
      }
    } else {
      setData(null);
      alert("Claim deleted successfully");
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">
        {/* ID Search Field */}
        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">Claim ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter claim ID"
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
            onClick={() => setOperation("create")}
            className={`px-4 py-2 rounded-lg ${
              operation === "create"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setOperation("read")}
            className={`px-4 py-2 rounded-lg ${
              operation === "read"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setOperation("update")}
            className={`px-4 py-2 rounded-lg ${
              operation === "update"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            Update
          </button>
          <button
            onClick={() => setOperation("delete")}
            className={`px-4 py-2 rounded-lg ${
              operation === "delete"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            Delete
          </button>
        </div>

        {/* Form for Create/Update */}
        {(operation === "create" || operation === "update") && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {operation === "create" ? "Create New Claim" : "Update Claim"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {validStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Policy ID</label>
                <input
                  type="text"
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {operation === "create" && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Claim ID</label>
                  <input
                    type="text"
                    name="claim_id"
                    value={formData.claim_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          data &&
          data.map((claim) => (
            <div key={claim.claim_id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    {operation === "delete" ? "Operation Result" : "Claim Details"}
                  </h1>
                  {operation !== "delete" && (
                    <p className="text-sm text-gray-500">ID: {claim.claim_id}</p>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-lg text-gray-900">{claim.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg text-gray-900">{formatAmount(claim.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-lg text-gray-900">{formatDate(claim.date)}</p>
                  </div>
                  <div>
                    <p
                      className={`text-lg font-semibold ${
                        claim.status === "Approved"
                          ? "text-green-600"
                          : claim.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {claim.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy ID</p>
                    <p className="text-lg text-gray-900">{claim.policy_id}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClaimCRUD;
