"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Building2, Plus, Edit, Trash2, Globe, MapPin } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  description: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export default function AdminCompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/companies");
      if (data.success) {
        setCompanies(data.companies);
      } else {
        setError(data.message || "Failed to fetch companies");
      }
    } catch (error) {
      setError("Error fetching companies");
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/companies/${companyId}`);
      if (data.success) {
        setCompanies(companies.filter(company => company._id !== companyId));
      } else {
        setError(data.message || "Failed to delete company");
      }
    } catch (error) {
      setError("Error deleting company");
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Companies</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage company profiles</p>
        </div>
        
        <Link
          href="/admin/companies/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Company</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">
              No companies have been added yet. Start by adding your first company.
            </p>
            <Link
              href="/admin/companies/new"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Company</span>
            </Link>
          </div>
        ) : (
          companies.map(company => (
            <div key={company._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {company.logoUrl ? (
                    <img 
                      src={company.logoUrl} 
                      alt={company.name} 
                      className="h-12 w-12 object-contain rounded-lg" 
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/companies/${company._id}`}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="View Company"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCompany(company._id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {company.description}
              </p>

              {/* Company Details */}
              <div className="space-y-2">
                {company.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{company.location}</span>
                  </div>
                )}
                
                {company.website && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {new URL(company.website).hostname}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
