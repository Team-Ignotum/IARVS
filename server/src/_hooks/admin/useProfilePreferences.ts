"use client";

import { useEffect, useState, type CSSProperties } from "react";

import {
  defaultPreferences,
  initialToggles,
  preferencesStorageKey,
  type FontSize,
  type Preferences,
  type ToggleKey,
} from "@/components/admin/profile-settings/types";

function readStoredPreferences(): Preferences {
  const defaults: Preferences = {
    toggles: { ...initialToggles },
    fontSize: "Medium",
  };

  try {
    const stored = localStorage.getItem(preferencesStorageKey);
    if (!stored) return defaults;

    const parsed = JSON.parse(stored) as Partial<Preferences>;
    const toggles = { ...initialToggles };

    for (const key of Object.keys(initialToggles) as ToggleKey[]) {
      if (typeof parsed.toggles?.[key] === "boolean") {
        toggles[key] = parsed.toggles[key];
      }
    }

    return {
      toggles,
      fontSize:
        parsed.fontSize === "Small" ||
        parsed.fontSize === "Large"
          ? parsed.fontSize
          : "Medium",
    };
  } catch {
    return defaults;
  }
}

export function useProfilePreferences() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [savedPreferences, setSavedPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const restored = readStoredPreferences();

    // Preferences live in localStorage, which is unavailable during
    // server rendering. Restoring them after mount keeps the server
    // markup and the first client render identical, avoiding a
    // hydration mismatch on the toggle and font-size controls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(restored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedPreferences(restored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  const hasUnsavedChanges =
    JSON.stringify(preferences) !==
    JSON.stringify(savedPreferences);

  const fontScale =
    preferences.fontSize === "Small"
      ? 0.9
      : preferences.fontSize === "Large"
        ? 1.2
        : 1;

  const pageStyle = {
    "--profile-font-scale": fontScale,
  } as CSSProperties;

  const toggleNotification = (key: ToggleKey) => {
    setPreferences((previous) => ({
      ...previous,
      toggles: {
        ...previous.toggles,
        [key]: !previous.toggles[key],
      },
    }));

    setMessage("");
  };

  const changeFontSize = (fontSize: FontSize) => {
    setPreferences((previous) => ({
      ...previous,
      fontSize,
    }));

    setMessage("");
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(
        preferencesStorageKey,
        JSON.stringify(preferences)
      );

      setSavedPreferences({
        ...preferences,
        toggles: { ...preferences.toggles },
      });

      setMessage("Preferences saved successfully.");
    } catch {
      setMessage("Unable to save preferences.");
    }
  };

  const discardPreferences = () => {
    setPreferences({
      ...savedPreferences,
      toggles: { ...savedPreferences.toggles },
    });

    setMessage("");
  };

  return {
    preferences,
    hasUnsavedChanges,
    isLoaded,
    message,
    pageStyle,
    toggleNotification,
    changeFontSize,
    savePreferences,
    discardPreferences,
  };
}
