'use client';

import React from 'react';
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
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Məlumatlar:</h3>
      <div className="text-xs text-gray-600 space-y-1">
        <p><strong>Admin:</strong> {credentials.admin.email} / {credentials.admin.password}</p>
        <p><strong>Menecer:</strong> {credentials.user.email} / {credentials.user.password}</p>
        <p><strong>Partnyor:</strong> {credentials.partner.email} / {credentials.partner.password}</p>
        <p><strong>OTP:</strong> {credentials.otp}</p>
      </div>
    </div>
  );
}
