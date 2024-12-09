'use client';

import React, { useState } from 'react';
import Heading from '../../../components/Heading';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from '../../../components/ui/alert-dialog';

const FriendsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsDialogOpen(true); // Open the dialog on successful copy
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  return (
    <div className="flex flex-col h-[88dvh]">
      <div className="p-4 flex-1">
        <Heading title="Refer" desc="for" desc2="inviting friends" />
        <main className="text-sm flex justify-between items-center p-2 bg-muted-foreground/10 rounded-xl">
          <p>Total</p>
          <p>No Users</p>
        </main>
      </div>
      <button
        className="bg-blue-500 mx-4 p-4 rounded-xl"
        onClick={() => copyToClipboard('https://t.me/PerksCryptoBot/perks?startapp')}
      >
        Invite
      </button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className='rounded-lg w-[90%]'>
          <AlertDialogTitle>Copied!</AlertDialogTitle>
          <AlertDialogDescription>
            The invite link has been copied to your clipboard. Share it with your friends!
          </AlertDialogDescription>
          <div className="flex justify-end">
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              Okay
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FriendsPage;
