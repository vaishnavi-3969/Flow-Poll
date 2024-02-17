import { config } from "@onflow/fcl";

config({
  "app.detail.title": "FlowPoll",
  "app.detail.icon": "https://s3.coinmarketcap.com/static-gravity/image/c5a26d43bc024c87894f5bb9971229a0.png",
  "flow.network": "testnet",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn",
  "0xFlowPoll": "0x6ec39faad55341c9",
});