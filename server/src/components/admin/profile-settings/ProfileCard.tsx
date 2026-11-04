"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Camera, Pencil, UserRound } from "lucide-react";

import {
  EditableField,
  ProfileField,
  SectionHeading,
} from "./fields";
import {
  cardClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";
import type { Profile, ProfileErrors } from "./types";
import { validateProfile } from "./validation";

const allowedPhotoTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const maxPhotoBytes = 5 * 1024 * 1024;

export function ProfileCard({
  profile,
  onSaveProfile,
}: {
  profile: Profile;
  onSaveProfile: (profile: Profile) => void;
}) {
  const [editedProfile, setEditedProfile] =
    useState<Profile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] =
    useState<ProfileErrors>({});
  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditedProfile({ ...profile });
    setProfileErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedProfile({ ...profile });
    setProfileErrors({});
    setIsEditing(false);
  };

  const updateProfile = (
    key: "fullName" | "phone" | "email",
    value: string
  ) => {
    setEditedProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setProfileErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  const handleSaveProfile = () => {
    const errors = validateProfile(editedProfile);
    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) return;

    onSaveProfile({
      ...editedProfile,
      fullName: editedProfile.fullName.trim(),
      phone: editedProfile.phone.trim(),
      email: editedProfile.email.trim(),
    });

    setIsEditing(false);
  };

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    if (!allowedPhotoTypes.includes(file.type)) {
      setPhotoError(
        "Only JPG, PNG or WebP images are allowed."
      );
      return;
    }

    if (file.size > maxPhotoBytes) {
      setPhotoError("Image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setPhotoError("");
      }
    };

    reader.onerror = () => {
      setPhotoError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className={cardClass}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SectionHeading
          icon={<UserRound size={17} />}
          title="Profile Information"
        />

        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className={secondaryButtonClass}
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        {/* PHOTO */}

        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePhoto}
                alt="Admin profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={40} className="text-slate-400" />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handlePhotoChange}
            className="hidden"
            aria-label="Upload profile photo"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Camera size={14} />
            Change Photo
          </button>

          <p className="max-w-44 text-center text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG or WebP — maximum 5 MB
          </p>

          {photoError && (
            <p
              role="alert"
              className="max-w-44 text-center text-xs text-red-500"
            >
              {photoError}
            </p>
          )}
        </div>

        {/* PROFILE DETAILS */}

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <EditableField
                label="Full Name"
                value={editedProfile.fullName}
                onChange={(value) =>
                  updateProfile("fullName", value)
                }
                error={profileErrors.fullName}
              />

              <ProfileField label="Role" value={profile.role} />

              <ProfileField
                label="Department"
                value={profile.department}
              />

              <ProfileField
                label="Study Centre"
                value={profile.studyCentre}
              />

              <EditableField
                label="Phone"
                type="tel"
                value={editedProfile.phone}
                onChange={(value) =>
                  updateProfile("phone", value)
                }
                error={profileErrors.phone}
              />

              <EditableField
                label="Email"
                type="email"
                value={editedProfile.email}
                onChange={(value) =>
                  updateProfile("email", value)
                }
                error={profileErrors.email}
              />

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className={primaryButtonClass}
                >
                  Save Profile
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <ProfileField
                label="Full Name"
                value={profile.fullName}
              />
              <ProfileField
                label="Role"
                value={profile.role}
              />
              <ProfileField
                label="Department"
                value={profile.department}
              />
              <ProfileField
                label="Study Centre"
                value={profile.studyCentre}
              />
              <ProfileField
                label="Phone"
                value={profile.phone}
              />
              <ProfileField
                label="Email"
                value={profile.email}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
