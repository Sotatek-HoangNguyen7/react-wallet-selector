import { useAppDispatch } from "./redux";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useRef } from "react";
import { setWalletInstalled } from "../slices/walletSlice";

export const useHasWalet = () => {
	const wallet = localStorage.getItem("wallet") || "MetamaskFlask";
	const firstTimeRun = useRef(null);
	const dispatch = useAppDispatch();
	const detectWallet = async () => {
		if (firstTimeRun.current) return;
		if (wallet === "MetamaskFlask") {
			try {
				const provider = await detectEthereumProvider({
					mustBeMetaMask: false,
					silent: true,
					timeout: 3000,
				});
				const isFlask = (await provider?.request({ method: "web3_clientVersion" }))?.includes("flask");
				if (provider && isFlask) {
					dispatch(setWalletInstalled(true));
				} else dispatch(setWalletInstalled(false));
			} catch (e) {
				dispatch(setWalletInstalled(false));
			} finally {
				firstTimeRun.current = true;
			}
		} else {
			if (window.mina) return dispatch(setWalletInstalled(true));
			return dispatch(setWalletInstalled(false));
		}
	};

	useEffect(() => {
		detectWallet();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
