export const formatMW = (mw: number) => {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(1)} GW`;
  }

  return `${Math.round(mw)} MW`;
};
