import { gql } from "../graphql";
import { getLatestSnapVersion, decodeMemo  } from "../utils/utils";
import {
  getTxHistoryQuery,
  TxPendingQuery,
	getAccountInfoQuery,
  // sendStakeDelegationGql,
	// getTxDetailQuery,
  // sendPaymentQuery,
  // getTxStatusQuery,
} from '../graphql/gqlparams';

const { ethereum } = window;
const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : "npm:test-mina-snap";
const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : "*";

export const WALLET = {
	MetamaskFlask: {
		methods: {
			connectToSnap: async () => {
				const latestSnapVersion = await getLatestSnapVersion();
				const version = snapVersion !== latestSnapVersion ? latestSnapVersion : snapVersion;

				return await ethereum.request({
					method: "wallet_requestSnaps",
					params: { [snapId]: { version: `^${version}` } },
				});
			},

			getSnap: async () => {
				await ethereum.request({ method: "wallet_getSnaps" });
			},

			getAccountInfors: async () => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_accountInfo",
						},
					},
				});
			},

			CreateAccount: async (name) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_createAccount",
							params: {
								name: name,
							},
						},
					},
				});
			},

			ChangeAccount: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_changeAccount",
							params: {
								accountIndex: payload.accountIndex,
								isImported: payload.isImported,
							},
						},
					},
				});
			},

			AccountList: async () => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_accountList",
						},
					},
				});
			},

			ImportAccount: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_importAccountByPrivateKey",
							params: {
								name: payload.name,
								privateKey: payload.privateKey,
							},
						},
					},
				});
			},

			EditAccountName: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_editAccountName",
							params: {
								name: payload.name,
								index: payload.index,
								isImported: payload.isImported,
							},
						},
					},
				});
			},

			ExportPrivateKey: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_exportPrivateKey",
							params: {
								index: payload.accountIndex,
								isImported: payload.isImported,
							},
						},
					},
				});
			},

			SendTransaction: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_sendPayment",
							params: {
								to: payload.receiveAddress,
								amount: payload.sendAmount,
								fee: payload.sendFee,
								memo: payload.sendMemoInput,
								nonce: 0,
								validUntil: 0,
							},
						},
					},
				});
			},

			getTxHistory: async () => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_getTxHistory",
							params: {
								limit: 15,
								sortBy: "DATETIME_DESC",
								canonical: true,
							},
						},
					},
				});
			},

			Signature: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_signMessage",
							params: {
								message: payload,
							},
						},
					},
				});
			},

			SwitchNetwork: async (payload) => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_changeNetwork",
							params: {
								networkName: payload,
							},
						},
					},
				});
			},

			RequestSnap: async () => {
				return await ethereum.request({
					method: "wallet_requestSnaps",
					params: {
						"npm:test-mina-snap": {},
					},
				});
			},

			GetNetworkConfigSnap: async () => {
				return await ethereum.request({
					method: "wallet_invokeSnap",
					params: {
						snapId: snapId,
						request: {
							method: "mina_networkConfig",
						},
					},
				});
			},
		},
	},

	Auro: {
		methods: {
			connectToAuro: async () => {
				return await window.mina.requestAccounts();
			},

			getAccountInfors: async (publicKey = "", urlProxy) => {
				const query = getAccountInfoQuery;
				const variables = { publicKey };

				const data = await gql(urlProxy, query, variables);

				/**return default data if the account does not have any tx */
				if (!data.account) {
					data.account = {
						balance: {
							total: "0",
						},
						nonce: "0",
						inferredNonce: "0",
						delegate: publicKey,
						publicKey,
					};
				}
				return data;
			},

			CreateAccount: async () => {},

			ChangeAccount: async () => {},

			AccountList: async () => {},

			ImportAccount: async () => {},

			EditAccountName: async () => {},

			ExportPrivateKey: async () => {},

			SendTransaction: async (payload) => {
				return await window.mina.sendLegacyPayment({
					amount: payload.sendAmount,
					to: payload.receiveAddress,
					fee: payload.sendFee,
					memo: payload.sendMemo,
				});
			},

			Stake: async (payload) => {
				return await window.mina.sendLegacyStakeDelegation({
					to: payload.vaildatorAddressInput,
					fee: payload.stakeFeeInput,
					memo: payload.stakeMemoInput,
				});
			},

			getTxHistory: async (urlProxy, address) => {
				const { pooledUserCommands: pendingTxs } = await gql(urlProxy, TxPendingQuery, { address });
				pendingTxs.forEach((tx) => {
					tx.memo = decodeMemo(tx.memo);
					tx.status = 'PENDING';
				});
			
				const { transactions } = await gql(urlProxy, getTxHistoryQuery, { limit: 10, sortBy: "DATETIME_ASC", canonical: false, address });
				transactions.forEach((tx) => {
					tx.memo = decodeMemo(tx.memo);
					tx.status = tx.failureReason ? 'FAILED' : 'APPLIED';
				});
			
				return [...pendingTxs.reverse(), ...transactions];
			},

			Signature: async (payload) => {
				return await window.mina.signMessage({
					message: payload,
				});
			},

			SwitchNetwork: async () => {},
		},
	},
};
