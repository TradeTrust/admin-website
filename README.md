# Document Web UI

[![Build Status](https://travis-ci.org/GovTechSG/document-web-ui.svg?branch=master)](https://travis-ci.org/GovTechSG/document-web-ui)

See also:

* [document-schema](https://github.com/GovTechSG/document-schema)
* [document-contract](https://github.com/GovTechSG/document-contract)
* [document-cli](https://github.com/GovTechSG/document-cli)

## Development

```bash
npm
npm dev
npm lint

npm run start # serves the ui
```

### Setting up web3

If your browser has injected web3 (ie. through Metamask), the application will connect to the injected web3 and will be on the network that provider is connected to. Otherwise, the application will attempt to connect to the local Ethereum node at port `9545`.

Setup 1:

- Install Metamask
- Run Ganache CLI/UI
- Connect Metamask to Ganache

Setup 2:

- Run Ganache CLI/UI on port `9545`
