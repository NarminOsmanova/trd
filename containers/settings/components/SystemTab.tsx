'use client';

import React from 'react';
import { SystemInfo, SupportInfo } from '../types/settings-type';
import { Badge } from '@/components/ui/badge';

interface SystemTabProps {
  systemInfo: SystemInfo;
  supportInfo: SupportInfo;
}

export default function SystemTab({ systemInfo, supportInfo }: SystemTabProps) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Sistem Məlumatları</h3>
        <p className="text-sm text-gray-600 mt-1">Sistem və versiya məlumatları</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Versiya Məlumatları</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">TRD Sistem</span>
                <span className="text-gray-900">{systemInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build</span>
                <span className="text-gray-900">{systemInfo.build}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment</span>
                <span className="text-gray-900">{systemInfo.environment}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Sistem Statusu</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">API Status</span>
                <Badge 
                  variant={systemInfo.apiStatus === 'online' ? 'success' : 'destructive'}
                  className="text-xs"
                >
                  {systemInfo.apiStatus === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database</span>
                <Badge 
                  variant={systemInfo.databaseStatus === 'connected' ? 'success' : 'destructive'}
                  className="text-xs"
                >
                  {systemInfo.databaseStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-900">{systemInfo.lastBackup}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Sistem Dəstəyi</h5>
          <p className="text-xs text-gray-600 mb-3">
            Texniki dəstək və suallarınız üçün bizimlə əlaqə saxlayın:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>📧 Email: {supportInfo.email}</p>
            <p>📞 Telefon: {supportInfo.phone}</p>
            <p>🕒 İş saatları: {supportInfo.workingHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
