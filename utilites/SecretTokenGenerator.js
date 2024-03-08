import crypto from "crypto"

function generateSecretToken() {

    const secretToken = crypto.randomBytes(256).toString("hex")

    return secretToken

}

generateSecretToken()

export const secretTokenValue = generateSecretToken()

console.log(secretTokenValue);