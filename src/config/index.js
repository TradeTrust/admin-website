export const NETWORK_TYPES = {
  INFURA_MAINNET: "INFURA_MAINNET",
  INFURA_ROPSTEN: "INFURA_ROPSTEN",
  LEDGER_MAIN: "LEDGER_MAIN",
  LEDGER_ROPSTEN: "LEDGER_ROPSTEN",
  INJECTED: "INJECTED",
  CUSTOM: "CUSTOM",
  MOCK: "MOCK"
};
export const IS_MAINNET = false;

export const INFURA_PROJECT_ID = "1f1ff2b3fca04f8d99f67d465c59e4ef";

export const SHARE_LINK_TTL = 1209600;
export const API_MAIN_URL = "https://api.opencerts.io";
export const API_ROPSTEN_URL = "https://api-ropsten.opencerts.io";

export const SHARE_LINK_API_URL = IS_MAINNET
  ? `${API_MAIN_URL}/storage`
  : `${API_ROPSTEN_URL}/storage`;
