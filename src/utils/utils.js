import axios from "axios";
import bs58check from "bs58check";

export const decodeMemo = (encode) => {
	try {
		const encoded = bs58check.decode(encode);
		const res = encoded.slice(3, 3 + encoded[2]).toString("utf-8");
		return res;
	} catch (err) {
		return encode;
	}
};

export const reverse = (bytes) => {
	const reversed = Buffer.alloc(bytes.length);
	for (let i = bytes.length; i > 0; i--) {
		reversed[bytes.length - i] = bytes[i - 1];
	}
	return reversed;
};

/**
 * Get GraphQL operation name.
 *
 * @param query - GraphQL query.
 * @returns `string`
 */
export function getOperationName(query = "") {
	const queryMatch = query.match(/(query|mutation) (\w+)(?=[(\s{])/u);

	if (queryMatch?.[2]) {
		return queryMatch[2];
	}

	throw new Error("GQL not valid");
}

export const getLatestSnapVersion = async () => {
	const version = await axios
		.get(`https://registry.npmjs.org/test-mina-snap/latest`)
		.then((res) => {
			const data = res.data;
			return data.version;
		})
		.catch((error) => console.log(error));
	return version;
};

export const formatBalance = (balance, dec = 4) => {
	const balanceNumb = Number(balance);
	if (balanceNumb > 0) {
		const [whole, decimal] = balance.split(".");
		const last = decimal.slice(0, dec);
		if (Number(last) === 0) {
			return whole;
		}

		return whole + "." + last;
	}
	return "0";
};

export const formatAddress = (address = "") => {
	const firstFiveCharacters = address.slice(0, 10);
	const lastFiveCharacters = address.slice(address.length - 10, address.length);
	return firstFiveCharacters + "..." + lastFiveCharacters;
};
