'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserViewModal from './UserViewModal';
import { mockData } from '@/lib/mock-data';

// Example component showing how to use the updated UserViewModal
export default function UserViewModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(mockData.users[0]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">UserViewModal Example</h2>
      <p className="text-gray-600 mb-6">
        Bu nümunə göstərir ki, UserViewModal indi DialogComponent istifadə edir və daha yaxşı funksionallıq təqdim edir.
      </p>
      
      <div className="space-y-4">
        <Button onClick={handleOpenModal}>
          İstifadəçi Məlumatlarını Göstər
        </Button>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Yeni Xüsusiyyətlər:</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Daha böyük ölçü (6xl) - daha çox məzmun üçün yer</li>
            <li>• Avtomatik bağlama funksiyası</li>
            <li>• Daha yaxşı scroll funksionallığı</li>
            <li>• Responsive dizayn</li>
            <li>• Dark mode dəstəyi</li>
            <li>• Daha yaxşı accessibility</li>
          </ul>
        </div>
      </div>

      <UserViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}
