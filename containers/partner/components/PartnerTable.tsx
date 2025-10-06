'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Percent
} from 'lucide-react';
import { PartnerItem } from '../types/partner-type';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PartnerTableProps {
  partners: PartnerItem[];
  onViewPartner: (partner: PartnerItem) => void;
  onEditPartner: (partner: PartnerItem) => void;
  onDeletePartner: (partnerId: string) => void;
  currentUserRole: 'admin' | 'user' | 'partner';
  currentUserId?: string;
}

export default function PartnerTable({
  partners,
  onViewPartner,
  onEditPartner,
  onDeletePartner,
  currentUserRole,
  currentUserId
}: PartnerTableProps) {
  const t = useTranslations();

  // Filter partners based on user role
  const filteredPartners = currentUserRole === 'admin' 
    ? partners 
    : partners.filter(partner => partner.id === currentUserId);

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Aktiv' : 'Deaktiv';
  };

  if (filteredPartners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentUserRole === 'admin' ? 'Partnyor tapılmadı' : 'Sizin məlumatlarınız tapılmadı'}
        </h3>
        <p className="text-gray-500">
          {currentUserRole === 'admin' 
            ? 'Hələ heç bir partnyor əlavə edilməyib' 
            : 'Sizin partnyor məlumatlarınız sistemdə yoxdur'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partnyor</TableHead>
            <TableHead>Ümumi Xərc</TableHead>
            <TableHead>Ümumi Gəlir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPartners.map((partner) => (
            <TableRow key={partner.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {partner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{partner.name}</p>
                    <p className="text-sm text-gray-500">{partner.email}</p>
                    {partner.company && (
                      <p className="text-xs text-gray-400">{partner.company}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-600">
                    {formatCurrency(partner.totalInvested)}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">
                    {formatCurrency(partner.totalEarned)}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={`${getStatusColor(partner.isActive)} border`}>
                  {getStatusLabel(partner.isActive)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="text-sm text-gray-600">
                  <p>{formatDate(partner.createdAt)}</p>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPartner(partner)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {currentUserRole === 'admin' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditPartner(partner)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeletePartner(partner.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
