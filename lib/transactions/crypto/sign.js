/*
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

var convert = require('./convert');
var keys = require('./keys');

function signMessageWithSecret (message, secret) {
	var msg = naclInstance.encode_utf8(message);
	var keypair = keys.getRawPrivateAndPublicKeyFromSecret(secret);

	var signedMessage = naclInstance.crypto_sign(msg, keypair.privateKey);
	var hexSignedMessage = convert.bufferToHex(signedMessage);

	return hexSignedMessage;
}

function signAndPrintMessage (message, secret) {
	var messageHeader = '-----BEGIN LISK SIGNED MESSAGE-----';
	var plainMessage = message;
	var signatureHeader = '-----BEGIN SIGNATURE-----';
	var publicKey = keys.getPrivateAndPublicKeyFromSecret(secret).publicKey;
	var signedMessage = signMessageWithSecret(message, secret);
	var signatureFooter = '-----END LISK SIGNED MESSAGE-----';

	var outputArray = [
		messageHeader, plainMessage, signatureHeader, publicKey, signedMessage, signatureFooter
	];

	return outputArray.join('\n');
}

function printSignedMessage (message, signedMessage, publicKey) {
	var messageHeader = '-----BEGIN LISK SIGNED MESSAGE-----';
	var plainMessage = message;
	var signatureHeader = '-----BEGIN SIGNATURE-----';
	var printPublicKey = publicKey;
	var printSignedMessage = signedMessage;
	var signatureFooter = '-----END LISK SIGNED MESSAGE-----';

	var outputArray = [
	 	messageHeader, plainMessage, signatureHeader, printPublicKey, printSignedMessage, signatureFooter
	];

	return outputArray.join('\n');
}

function verifyMessageWithPublicKey (signedMessage, publicKey) {
	var signedMessageBytes = convert.hexToBuffer(signedMessage);
	var publicKeyBytes = convert.hexToBuffer(publicKey);

	var openSignature = naclInstance.crypto_sign_open(signedMessageBytes, publicKeyBytes);

	// Returns original message
	return naclInstance.decode_utf8(openSignature);
}

module.exports = {
	verifyMessageWithPublicKey: verifyMessageWithPublicKey,
	signMessageWithSecret: signMessageWithSecret,
	printSignedMessage: printSignedMessage,
	signAndPrintMessage: signAndPrintMessage
};
