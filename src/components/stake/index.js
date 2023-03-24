import React, { useState } from "react";
import { WALLET } from "../../services/multipleWallet";

const Stake = () => {
	const [stakeContent, setStakeContent] = useState({
		vaildatorAddressInput: "",
		stakeFeeInput: "",
		stakeMemoInput: "",
	});

	const [stakingResultDisplay, setStakingResultDisplay] = useState("");

	const handleChangeStakeContent = (e) => {
		setStakeContent({
			...stakeContent,
			[e.target.id]: e.target.value,
		});
	};

	const stakingButton = async () => {
		const wallet = localStorage.getItem("wallet") || "MetamaskFlask";
		setStakingResultDisplay("");
		if (wallet === "Auro") {
			const result = await WALLET.Auro.methods.Stake(stakeContent).catch((err) => console.log(err));
			if (result.hash) {
				setStakingResultDisplay(result.hash);
			} else {
				setStakingResultDisplay(result.message);
			}
		} else {
			try {
				const result = await WALLET.MetamaskFlask.methods.Stake(stakeContent)
				if (result) {
					setStakingResultDisplay(JSON.stringify(result))
				} else {
					setStakingResultDisplay("reject");
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
					<h4 className="card-title">Staking</h4>
					<hr />
					<div id="encrypt-message-form">
						<input
							className="form-control"
							type="text"
							placeholder="Adress"
							id="vaildatorAddressInput"
							onChange={handleChangeStakeContent}
						/>
						<hr />
						<input
							className="form-control"
							type="text"
							placeholder="Fee (option)"
							id="stakeFeeInput"
							onChange={handleChangeStakeContent}
						/>
						<hr />
						<input
							className="form-control"
							type="text"
							placeholder="Memo (option)"
							id="stakeMemoInput"
							onChange={handleChangeStakeContent}
						/>
						<hr />
						<button
							onClick={stakingButton}
							className="btn btn-primary btn-md d-flex justify-content-center"
							id="stakingButton">
							Staking
						</button>
					</div>
					<hr />
					<p className="info-text alert alert-secondary">
						Send Result: <span id="stakingResultDisplay">{stakingResultDisplay}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Stake;
