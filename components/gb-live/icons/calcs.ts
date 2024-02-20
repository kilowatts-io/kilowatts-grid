const SIZE_PX_PER_MW_CAPACITY = 0.0125;
export const calculateSizePx = (capacity: number) =>
  Math.max(3, Math.round(capacity * SIZE_PX_PER_MW_CAPACITY));
