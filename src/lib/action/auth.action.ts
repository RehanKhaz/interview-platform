'use server';
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export const signUp = async (params: SignUpParams) => {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get()
        if (userRecord.exists) {
            return {
                success: false,
                message: 'You are registered. Please Sign In instead.'
            }
        }

        db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account Created Successfully. Redirecting to Sign In.'
        }

    } catch (e: any) {
        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is in use.'
            }
        }

        return {
            success: false,
            message: "Error Occured. Please Try later."
        }

    }


}

export const setSessionCookie = async (tokenID: string) => {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    const cookie = await cookies()
    const sessionCookie = await auth.createSessionCookie(tokenID, {
        expiresIn: ONE_WEEK * 1000
    })

    cookie.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export const signIn = async (params: SignInParams) => {
    const { idToken, email } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User doesn't Exist. Try Sign Up Instead"
            }
        }

        await setSessionCookie(idToken)

    } catch (e) {
        return {
            success: false,
            message: "Failed to Sign in into your account. Please Try later."
        }

    }
}

export const getCurrentUser = async (): Promise<User | null> => {
    const cookie = await cookies();
    const sessionCookie = cookie.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null
        }

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User

    } catch (error) {
        console.log(error)
        return null
    }
}

export const isAuthenticated = async () => {
    const user = await getCurrentUser();
    return !!user;
}