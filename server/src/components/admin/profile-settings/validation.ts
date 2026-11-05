import type { Profile, ProfileErrors } from "./types";

export function validateProfile(values: Profile): ProfileErrors {
  const errors: ProfileErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName =
      "Full name must contain at least 3 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const phone = values.phone.replace(/[\s-]/g, "");

  if (!/^(?:0[1-9]\d{8}|\+94[1-9]\d{8})$/.test(phone)) {
    errors.phone = "Enter a valid Sri Lankan phone number.";
  }

  return errors;
}
