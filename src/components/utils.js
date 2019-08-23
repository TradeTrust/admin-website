import { isAddress, toChecksumAddress } from "web3-utils";

// eslint-disable-next-line import/prefer-default-export
export const isValidAddress = address => {
  try {
    return isAddress(toChecksumAddress(address));
  } catch (e) {
    return false;
  }
};

export const isValidDocumentHash = input => /^0x[a-fA-F0-9]{64}$/.test(input);

export const createBaseDocument = () => ({
  id: (+new Date()).toString(),
  $template: {
    name: "NULL",
    type: "EMBEDDED_RENDERER",
    url: "stanchart.tradetrust.io/renderer"
  },
  issuers: []
});

const validExt = /(.*)(\.)(pdf)$/;

export const isValidFileExtension = fileName =>
  validExt.test(fileName.toLowerCase());
