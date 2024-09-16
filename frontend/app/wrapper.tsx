"use client";
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import LoadingModal from './components/LoadingModal';
import CryptoContext from './context/CryptoContext';
import generateEcdhKeyPair, { deserializeECDHPrivateKey, deserializeECDHPublicKey, serializeECDHKey } from './libs/crypto/ecdh';

const loadEcdhKeysFromHexist = (publicKey: string, privateKey: string) => {
    return {
        publicKey: deserializeECDHPublicKey(publicKey),
        privateKey: deserializeECDHPrivateKey(privateKey),
    }
}

// wrapper only exists when the user is authenticated (logged in)
const RootWrapper: React.FC<React.PropsWithChildren<{
}>> = ({ children }) => {
    const { status: authStatus, data: sessionData } = useSession()
    const [userKey, setUserKey] = useState<{
        publicKey: any,
        privateKey: any,
    }>();

    useEffect(() => {
        if (authStatus === 'authenticated') {
            const sessionDataAny = (sessionData as any);
            const key = loadEcdhKeysFromHexist(sessionDataAny.ecdh_public_key, sessionDataAny.ecdh_private_key);
            setUserKey(key)
        }

        return () => { }
    }, [authStatus])

    if (authStatus !== 'authenticated') {
        return <>{children}</>
    } else if (!userKey) {
        return <LoadingModal />
    }

    return <CryptoContext.Provider value={{
        loggedInUserKey: userKey,
    }}>
        {children}
    </CryptoContext.Provider>;
}

export default RootWrapper