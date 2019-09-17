# Document Web UI

See also:

* [Tradetrust Schemas](https://github.com/TradeTrust/tradetrust-schema)
* [Document Store Ethereum Smart Contract](https://github.com/Open-Attestation/document-store-contract)
* [ERC 721](http://erc721.org/)
* [Tradetrust CLI Tool](https://github.com/TradeTrust/tradetrust-cli)

## Development

```bash
npm install
npm run dev
npm run lint

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
