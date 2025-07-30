import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ContractGuard',
  projectId: 'YOUR_PROJECT_ID', // You can get this from https://cloud.walletconnect.com
  chains: [mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});