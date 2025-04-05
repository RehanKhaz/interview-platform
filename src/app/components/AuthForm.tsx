'use client'
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FormField from "./FormField"
import Logo from "./Logo"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/action/auth.action"


const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter()
    const isSignIn = type === 'sign-in'

    const formSchema = z.object({
        name: !isSignIn ? z.string().min(2, 'User Name must be atleast 2 characters.') : z.string().optional(),
        email: z.string().email().refine(val => val.endsWith('@gmail.com'), {
            message: "Email must end with @gmail.com"
        }),
        password: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {


        try {
            if (isSignIn) {
                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();
                if (!idToken) {
                    toast.error('Failed To Sign In. Try Again Later')
                    return
                }
                await signIn({  email , idToken })

                router.push('/')
                toast.success('Login Successfully.')
            }
            else {
                const { name, email, password } = values;
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)

                const result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                    password
                })

                if (!result?.success) {
                    toast.error(result?.message)
                    return;
                }

                router.push('/sign-in')
            }

        } catch (e:any) {
            toast.error(e.message)
        }
    }


    return (
        <div className="max-w-[500px] scale-[1.12] w-[22em] ">
            <div className="px-4 py-2 card flex w-full flex-col gap-2 items-center justify-center">
                <Logo />
                <p className="text-lg">Prepare Job Interviews with AI.</p>
                <FormProvider {...form}>
                    <form className="form flex  flex-col gap-2 mt-3 " onSubmit={form.handleSubmit(onSubmit)} >
                        {!isSignIn && <FormField
                            name={'name'}
                            placeholder={'Enter your Name'}
                            label={'User Name'}
                            type="text"
                        />}
                        <FormField
                            name={'email'}
                            placeholder={'Enter your Email'}
                            label={'Email'}
                            type="email"
                        />
                        <FormField
                            name={'password'}
                            placeholder={'Enter your Password'}
                            label={'Password'}
                            type="password"
                        />
                        <button type="submit" className="btn mt-3 ">
                            {isSignIn ? 'Sign In' : 'Create Account'}
                        </button>
                        {
                            !isSignIn ? <p className="text-center">
                                Have an Account Already! <Link
                                    className="font-bold tracking-wide"
                                    href={'/sign-in'}>
                                    Sign In
                                </Link>
                            </p> : <p className="text-center">
                                Wanna Create Account! <Link className="font-bold tracking-wide" href={'/sign-up'}>
                                    Sign Up
                                </Link>
                            </p>
                        }
                    </form>

                </FormProvider>
            </div>
        </div>
    )

}


export default AuthForm