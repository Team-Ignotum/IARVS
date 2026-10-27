export const REGIONAL_CENTRES = [
  "Colombo (Nawala Main Campus)",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Jaffna",
  "Kandy",
  "Kurunegala",
  "Matara",
  "Ratnapura",
] as const;

export const STUDY_CENTRES = [
  "Ambalangoda",
  "Ambalantota",
  "Ampara",
  "Bandarawela",
  "Galle",
  "Gampaha",
  "Hatton",
  "Kalutara",
  "Kegalle",
  "Kilinochchi",
  "Kuliyapitiya",
  "Mannar",
  "Matale",
  "Monaragala",
  "Mullaitivu",
  "Polonnaruwa",
  "Puttalam",
  "Trincomalee",
  "Vavuniya",
] as const;

export const CENTRES = [...REGIONAL_CENTRES, ...STUDY_CENTRES] as const;
export type Centre = (typeof CENTRES)[number];
