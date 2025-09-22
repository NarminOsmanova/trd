"use client";

import React, { useState } from "react";
import DialogComponent from "./DialogComponent";
import AdvancedDialogComponent from "./AdvancedDialogComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Example usage of DialogComponent
export const DialogExamples = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-6">Dialog Component Examples</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Basic Dialog */}
        <Button onClick={() => setBasicOpen(true)}>
          Basic Dialog
        </Button>

        {/* Advanced Dialog */}
        <Button onClick={() => setAdvancedOpen(true)}>
          Advanced Dialog
        </Button>

        {/* Loading Dialog */}
        <Button onClick={() => setLoadingOpen(true)}>
          Loading Dialog
        </Button>

        {/* Fullscreen Dialog */}
        <Button onClick={() => setFullscreenOpen(true)}>
          Fullscreen Dialog
        </Button>
      </div>

      {/* Basic Dialog Example */}
      <DialogComponent
        open={basicOpen}
        setOpen={setBasicOpen}
        title="Əsas Dialog"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu sadə dialog komponenti nümunəsidir. Burada istədiyiniz məzmunu əlavə edə bilərsiniz.
          </p>
          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input id="name" placeholder="Adınızı daxil edin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email ünvanınızı daxil edin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea id="message" placeholder="Mesajınızı yazın" />
          </div>
        </div>
      </DialogComponent>

      {/* Advanced Dialog Example */}
      <AdvancedDialogComponent
        open={advancedOpen}
        setOpen={setAdvancedOpen}
        title="Təkmilləşdirilmiş Dialog"
        size="lg"
        animation="slide"
        backdrop="blur"
        actions={{
          primary: {
            label: "Yadda Saxla",
            onClick: () => {
              console.log("Primary action clicked");
              setAdvancedOpen(false);
            },
            variant: "default"
          },
          secondary: {
            label: "Ləğv Et",
            onClick: () => {
              console.log("Secondary action clicked");
              setAdvancedOpen(false);
            },
            variant: "outline"
          }
        }}
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Məlumat</h3>
            <p className="text-gray-600">
              Bu təkmilləşdirilmiş dialog komponenti daha çox funksionallıq təqdim edir.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input id="firstName" placeholder="Adınız" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input id="lastName" placeholder="Soyadınız" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea 
              id="description" 
              placeholder="Ətraflı təsvir yazın..."
              rows={4}
            />
          </div>
        </div>
      </AdvancedDialogComponent>

      {/* Loading Dialog Example */}
      <DialogComponent
        open={loadingOpen}
        setOpen={setLoadingOpen}
        title="Yüklənir..."
        size="sm"
        loading={true}
        showCloseButton={false}
        closeOnOutsideClick={false}
        closeOnEscape={false}
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Məlumatlar yüklənir...</p>
        </div>
      </DialogComponent>

      {/* Fullscreen Dialog Example */}
      <AdvancedDialogComponent
        open={fullscreenOpen}
        setOpen={setFullscreenOpen}
        title="Tam Ekran Dialog"
        size="full"
        animation="fade"
        backdrop="dark"
        customHeader={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tam Ekran Məzmun</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreenOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Kart {item}</h3>
                <p className="text-gray-600">
                  Bu tam ekran dialogda daha çox məzmun göstərə bilərsiniz.
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Əlavə Məlumat</h3>
            <p className="text-gray-600 mb-4">
              Tam ekran dialoglar böyük məzmun üçün ideal həllərdir.
            </p>
            <div className="space-y-2">
              <Label htmlFor="fullscreenInput">Giriş sahəsi</Label>
              <Input id="fullscreenInput" placeholder="Burada yazın..." />
            </div>
          </div>
        </div>
      </AdvancedDialogComponent>
    </div>
  );
};

export default DialogExamples;
