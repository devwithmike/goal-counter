export function convertToBinary(hitMissString) {
	return hitMissString.replace(/\+/g, '1').replace(/-/g, '0');
}

export function convertFromBinary(binaryString) {
	return binaryString.replace(/1/g, '+').replace(/0/g, '-');
}
