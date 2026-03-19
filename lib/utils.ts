export const materialKeys = ['paper', 'plastic', 'glass', 'metal', 'wood', 'other'] as const;
export type MaterialKey = (typeof materialKeys)[number];

export type MaterialsPayload = Record<MaterialKey, { kg: number; units: number }>;

export const emptyMaterials = (): MaterialsPayload => ({
  paper: { kg: 0, units: 0 },
  plastic: { kg: 0, units: 0 },
  glass: { kg: 0, units: 0 },
  metal: { kg: 0, units: 0 },
  wood: { kg: 0, units: 0 },
  other: { kg: 0, units: 0 }
});
