'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building } from 'lucide-react';
import { CompanyItem } from '../types/company-type';

interface Props {
  data: CompanyItem[];
  onEdit: (item: CompanyItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export default function CompaniesTable({ data, onEdit, onDelete, onToggleActive }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlıq</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {c.logoUrl ? (
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden border">
                      {/* Accepts data URL or normal URL */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logoUrl} alt={c.title} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{c.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(c.id)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      c.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {c.isActive ? 'Aktiv' : 'Passiv'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
                      <Edit className="w-3 h-3 mr-1" /> Redaktə
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(c.id)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


