'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

export default function LoginHeader() {
  
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Report Sistem
      </h1>
      <p className="text-gray-600">
        Layihə İdarəetmə və Xərclərin Hesabat Sistemi
      </p>
    </div>
  );
}
