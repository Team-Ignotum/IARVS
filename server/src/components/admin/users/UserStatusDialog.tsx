"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserStatus } from "@/_hooks/admin/useUpdateUserStatus";
import type { UserRecord } from "./types";

interface UserStatusDialogProps {
  /** The user to toggle; `null` keeps the dialog closed. */
  user: UserRecord | null;
  onClose: () => void;
}

export default function UserStatusDialog({ user, onClose }: UserStatusDialogProps) {
  const mutation = useUpdateUserStatus();

  const isActive = user?.status === "Active";
  const nextStatus = isActive ? "INACTIVE" : "ACTIVE";

  function handleClose() {
    mutation.reset();
    onClose();
  }

  function handleConfirm() {
    if (!user) return;

    mutation.mutate(
      { userId: user.id, status: nextStatus },
      { onSuccess: handleClose },
    );
  }

  return (
    <Dialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change user status?</DialogTitle>
          <DialogDescription>
            {user?.name} is currently {isActive ? "active" : "inactive"}. This
            will change the account to {isActive ? "inactive" : "active"}
            {isActive
              ? ", so they will no longer be able to sign in."
              : ", so they will be able to sign in again."}
          </DialogDescription>
        </DialogHeader>

        {mutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {mutation.error.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
            className="inline-flex h-9 items-center rounded-md bg-[#183b68] px-4 text-sm font-medium text-white hover:bg-[#102d52] disabled:opacity-60"
          >
            {mutation.isPending ? "Updating…" : "Change status"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
