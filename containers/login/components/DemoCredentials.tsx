'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { DemoCredentials as DemoCredentialsType } from '../types/login-type';

interface DemoCredentialsProps {
  showOtp: boolean;
  credentials: DemoCredentialsType;
}

export default function DemoCredentials({ showOtp, credentials }: DemoCredentialsProps) {
  
  if (showOtp) {
    return null;
  }

  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Demo Hesablar</h3>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-xs font-semibold text-gray-700 mb-1">Admin:</p>
              <p className="text-xs font-mono text-gray-600">{credentials.admin.email}</p>
              <p className="text-xs font-mono text-gray-600">{credentials.admin.password}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-xs font-semibold text-gray-700 mb-1">Menecer:</p>
              <p className="text-xs font-mono text-gray-600">{credentials.user.email}</p>
              <p className="text-xs font-mono text-gray-600">{credentials.user.password}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
