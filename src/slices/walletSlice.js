import { createSlice } from '@reduxjs/toolkit';
const ethers = require("ethers")

const initialState = {
  isLoadingGlobal: false,
  accountName: '',
  balance: '',
  inferredNonce: '',
  activeAccount: '',
  isInstalledWallet: false,
  isInstalledSnap: false,
  connected: false,
  isLoading: false,
  forceReconnect: false,
  accounts: [],
  erc20TokenBalances: [],
  erc20TokenBalanceSelected: {},
  transactions: [],
  detailsAccount: undefined,
  detailTransaction: undefined,
  network: ""
};


export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setDetailsAccount: (state, { payload }) => {
      state.detailsAccount = payload;
    },
    setNetWork: (state, { payload }) => {
      state.network = payload;
    },
    setActiveAccount: (state, { payload }) => {
      state.activeAccount = payload.activeAccount;
      state.balance = payload.balance
      state.accountName = payload.accountName
      state.inferredNonce = payload.inferredNonce
    },

    setSnapInstalled: (state, { payload }) => {
      state.isInstalledSnap = payload;
    },
    setWalletInstalled: (state, { payload }) => {
      state.isInstalledWallet = payload;
    },
    setWalletConnection: (state, { payload }) => {
      state.connected = payload;
    },
    setIsLoadingGlobal: (state, { payload }) => {
      state.isLoadingGlobal = payload;
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    connectWallet: (state, { payload }) => {
      state.connected = true;
      state.isInstalledWallet = true;
      state.isInstalledSnap = true
      state.accounts = payload.accountList
      return state;
    },

    setListAccounts: (state, { payload }) => {
      state.accounts = payload
      return state;
    },
    setForceReconnect: (state, { payload }) => {
      state.forceReconnect = payload;
    },
    setAccounts: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.accounts = payload.map((account) => account.address);
      } else {
        state.accounts.push(payload.address);
      }
    },
    setErc20TokenBalances: (state, { payload }) => {
      state.erc20TokenBalances = payload;
    },
    upsertErc20TokenBalance: (state, { payload }) => {
      // only update erc20TokenBalances if same chainId as selected token
      if (state.erc20TokenBalanceSelected.chainId === payload.chainId) {
        const foundIndex = state.erc20TokenBalances.findIndex(
          (token) =>
            ethers.BigNumber.from(token.address).eq(ethers.BigNumber.from(payload.address)) &&
            ethers.BigNumber.from(token.chainId).eq(ethers.BigNumber.from(payload.chainId)),
        );
        if (foundIndex < 0) {
          state.erc20TokenBalances.push(payload);
        } else {
          state.erc20TokenBalances[foundIndex].amount = payload.amount;
          state.erc20TokenBalances[foundIndex].usdPrice = payload.usdPrice;

          if (
            state.erc20TokenBalanceSelected.address === state.erc20TokenBalances[foundIndex].address &&
            state.erc20TokenBalanceSelected.chainId === state.erc20TokenBalances[foundIndex].chainId
          ) {
            state.erc20TokenBalanceSelected.amount = state.erc20TokenBalances[foundIndex].amount;
            state.erc20TokenBalanceSelected.usdPrice = state.erc20TokenBalances[foundIndex].usdPrice;
          }
        }
      }
    },
    setErc20TokenBalanceSelected: (state, { payload }) => {
      state.erc20TokenBalanceSelected = payload;
    },
    clearAccounts: (state) => {
      state.accounts = [];
    },
    resetWallet: () => {
      return {
        ...initialState,
        forceReconnect: true,
      };
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload
      return state;
    },
  },
});

export const {
  setDetailsAccount,
  setListAccounts,
  setActiveAccount,
  setNetWork,
  setIsLoading,
  connectWallet,
  setWalletInstalled,
  setWalletConnection,
  setForceReconnect,
  setAccounts,
  clearAccounts,
  setErc20TokenBalances,
  setErc20TokenBalanceSelected,
  upsertErc20TokenBalance,
  setTransactions,
  resetWallet,
  setIsLoadingGlobal
} = walletSlice.actions;

export default walletSlice.reducer;
