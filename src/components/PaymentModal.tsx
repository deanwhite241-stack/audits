import React, { useState } from 'react';
import { X, Wallet, CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { web3Service } from '../services/web3';

interface PaymentModalProps {
  contractAddress: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  contractAddress,
  onClose,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'USDT'>('ETH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { isConnected } = useAccount();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      if (!isConnected) {
        setError('Please connect your wallet first');
        return;
      }

      if (paymentMethod === 'ETH') {
        await web3Service.payForAuditETH(contractAddress);
      } else {
        await web3Service.payForAuditUSDT(contractAddress);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Unlock Premium Analysis</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                20 Advanced Security Modules (Gas, Reentrancy, Access Control, etc.)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                8 DeFi Security Modules (Flash Loans, Oracle, AMM, Liquidity Pool)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                4 Economic Analysis Modules (Tokenomics, Attack Simulation)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                3 Behavioral Analysis Modules (On-chain, Reputation, Dependencies)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Professional PDF Report with Executive Summary & Analytics
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('ETH')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === 'ETH'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">ETH</div>
                    <div className="text-sm text-gray-500">0.01 ETH</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('USDT')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === 'USDT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">USDT</div>
                    <div className="text-sm text-gray-500">15 USDT</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!isConnected && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Please connect your wallet to proceed with payment:</p>
              <ConnectButton />
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing || !isConnected}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Pay with {paymentMethod}</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Payment will be processed through MetaMask. Make sure you have sufficient balance.
          </p>
        </div>
      </div>
    </div>
  );
};