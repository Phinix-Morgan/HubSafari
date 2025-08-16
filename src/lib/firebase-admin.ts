import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, getApp, initializeApp, App } from 'firebase-admin/app';

function getAdminAppSafe(): App {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp();
}

const adminApp = getAdminAppSafe();
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
