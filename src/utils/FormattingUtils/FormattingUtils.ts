/**
 * Format address
 * @param address - the address
 * @param lengthBefore - (optional, default 4) the characters to show before the dots
 * @param lengthAfter - (optional, default 4) the characters to show after the dots
 * @returns the formatted address
 */
export const humanAddress = (
  address: string,
  lengthBefore = 4,
  lengthAfter = 10
) => {
  const before = address.substring(0, lengthBefore);
  const after = address.substring(address.length - lengthAfter);
  return `${before}…${after}`;
};

export const formatNumberPrecision = (
  number: number | string,
  precision: number
) => {
  return Number.parseFloat(number.toString()).toFixed(precision);
};

/**
 * Convert an ipfs uri to an https url
 * @example ipfsUriToHttps("ipfs:// QmZ4YX8 ...") => "https://ipfs.io/ipfs/QmZ4YX8 ..."
 * @param ipfsUri string
 * @returns  the https url
 */
export const ipfsUriToHttps = (ipfsUri: string) => {
  // Check if the input starts with "ipfs://"
  if (!ipfsUri.startsWith("ipfs://")) return null;

  // Extract the CID portion by removing "ipfs://"
  const cid = ipfsUri.slice(7);

  // Construct the HTTPS URL using a public gateway
  return `https://ipfs.io/ipfs/${cid}`;
};
