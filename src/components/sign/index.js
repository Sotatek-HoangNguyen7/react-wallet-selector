import React, { useState } from "react";
import { WALLET } from "../../services/multipleWallet";

const Sign = () => {
	const [signMessageContent, setSignMessageContent] = useState("");
	const [signMessageResult, setSignMessageResult] = useState("");

	const handleChangeSignMessageContent = (e) => {
		setSignMessageContent(e.target.value);
	};

	const signMessageButton = async () => {
		const wallet = localStorage.getItem("wallet") || "MetamaskFlask";
		setSignMessageResult("");
		if (wallet === "Auro") {
			const signResult = await WALLET.Auro.methods.Signature(signMessageContent).catch((err) => err);
			if (signResult.signature) {
				setSignMessageResult(JSON.stringify(signResult.signature));
			} else {
				setSignMessageResult(signResult.message);
			}
		} else {
			try {
				const signResult = await WALLET.MetamaskFlask.methods.Signature(signMessageContent);
				if (signResult) {
					setSignMessageResult(JSON.stringify(signResult));
				} else {
					setSignMessageResult("reject");
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div>
			<div className="card full-width">
				<div className="card-body">
					<h4 className="card-title">Sign</h4>
					<hr />
					<div id="encrypt-message-form">
						<input
							className="form-control"
							type="text"
							placeholder="Set sign content"
							id="signMessageContent"
							onChange={handleChangeSignMessageContent}
						/>
						<hr />
						<button
							onClick={signMessageButton}
							className="btn btn-primary btn-md d-flex justify-content-center"
							id="signMessageButton">
							Sign
						</button>
					</div>
					<hr />
					<p className="info-text alert alert-secondary">
						Sign result: <span id="signMessageResult">{signMessageResult}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Sign;
