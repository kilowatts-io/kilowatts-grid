



export const formatMW = (mw: number) => {
    if (mw > 1000 || mw < -1000) {
      return `${(mw / 1000).toFixed(2)}GW`;
    }
    return `${mw.toFixed(0)}MW`;
  };
  