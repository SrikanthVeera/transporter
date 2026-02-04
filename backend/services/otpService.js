

const admin = require('./firebaseService');

/**
 * Verify Firebase ID Token
 * @param {string} idToken - The token received from client after phone auth
 * @param {string} mobile - The mobile number to verify against
 */
async function verifyFirebaseToken(idToken, mobile) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Normalize mobile numbers (remove +91 if present for comparison, or matching format)
        // Firebase returns +919999999999
        // Input mobile is usually 9999999999

        const firebaseMobile = decodedToken.phone_number || '';
        const standardMobile = mobile.replace(/\D/g, '').slice(-10);
        const standardFirebase = firebaseMobile.replace(/\D/g, '').slice(-10);

        if (standardMobile === standardFirebase) {
            // We do not need to update otp_logs anymore since we don't insert them on send.
            // Just return success.
            return { valid: true, uid: decodedToken.uid };
        } else {
            return { valid: false, reason: 'Mobile number mismatch' };
        }
    } catch (error) {
        console.error('Firebase Token Verification Failed:', error);
        return { valid: false, reason: 'Invalid or expired token' };
    }
}

module.exports = {
    verifyFirebaseToken
};
