'use client';

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockData } from '@/lib/mock-data';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface UsersManagementTabProps {
  onCreateOrUpdate?: (user: User) => void;
}

export default function UsersManagementTab({ onCreateOrUpdate }: UsersManagementTabProps) {
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({
    phone: '',
    role: 'user',
  });

  const filteredUsers = useMemo(() => users, [users]);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', position: '', role: 'user', isActive: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;

    if (editing) {
      const updated: User = {
        ...editing,
        phone: form.phone || '',
        role: form.role as User['role'],
        updatedAt: new Date().toISOString(),
      };
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      onCreateOrUpdate?.(updated);
    } else {
      const created: User = {
        id: Math.random().toString(36).slice(2, 9),
       
        phone: form.phone || '',
        role: (form.role as User['role']) ?? 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers(prev => [created, ...prev]);
      onCreateOrUpdate?.(created);
    }
    resetForm();
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setForm({
      phone: u.phone,
      role: u.role,
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editing ? 'İstifadəçini Yenilə' : 'Yeni İstifadəçi Əlavə Et'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input placeholder="Telefon (+994...)" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select value={(form.role as string) || 'user'} onValueChange={(v) => setForm({ ...form, role: v as User['role'] })}>
            <SelectTrigger><SelectValue placeholder="Rol" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Əməkdaş</SelectItem>
              <SelectItem value="partner">Partnyor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button type="submit">{editing ? 'Yenilə' : 'Əlavə et'}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={resetForm}>Ləğv et</Button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">İstifadəçilər</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 px-4">Ad Soyad</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Vəzifə</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tarix</th>
                <th className="py-3 px-4 text-right">Əməllər</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{u.name}</td>
                  <td className="py-3 px-4 text-gray-600">{u.email}</td>
                  <td className="py-3 px-4 text-gray-600">{u.position || '-'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'admin' ? 'secondary' : 'default'}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'partner' ? 'Partnyor' : 'Əməkdaş'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.isActive ? 'success' : 'destructive'}>
                      {u.isActive ? 'Aktiv' : 'Qeyri-aktiv'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(u)}>Düzəlt</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


