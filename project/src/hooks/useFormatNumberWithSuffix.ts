export const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return num / 1_000_000_000 + "b+";
  } else if (num >= 1_000_000) {
    return num / 1_000_000 + "m+";
  } else if (num >= 100_000) {
    return num / 1_000 + "k+";
  } else {
    return num.toLocaleString();
  }
};
