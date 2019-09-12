import { isAddress, toChecksumAddress } from "web3-utils";
import { get } from "lodash";
import { getData } from "@govtechsg/open-attestation";

const Dropbox = require("dropbox");
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
    url: "https://demo-co.openattestation.com"
  },
  issuers: []
});

const validExt = /(.*)(\.)(pdf)$/;

export const isValidFileExtension = fileName =>
  validExt.test(fileName.toLowerCase());

export const uploadFile = async file => {
  const ACCESS_TOKEN =
    "HSoTbMxiWcAAAAAAAAAAKIR3Kxl2D5K_GclsAYwztvM6XX8ipOTmj5eGJcIhtlGN";
  const dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
  const data = getData(file);
  const url = get(data, "documentUrl");
  try {
    await dbx.filesUpload({ path: url, contents: JSON.stringify(file) });
    return true;
  } catch (e) {
    return false;
  }
};
