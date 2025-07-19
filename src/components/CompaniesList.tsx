"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  description: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export default function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCompanies(data.companies);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
      
      {companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">
            No companies have been added to the platform yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(c => (
            <Link
              key={c._id}
              href={`/companies/${c._id}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow flex flex-col"
            >
              {c.logoUrl ? (
                <img src={c.logoUrl} alt={c.name} className="h-12 w-12 object-contain mb-4" />
              ) : (
                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">{c.name}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{c.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
