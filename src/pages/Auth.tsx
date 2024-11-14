import { ChangeEvent, CSSProperties, FocusEvent, useEffect, useRef, useState } from 'react';
import GoogleSearchLogo from '../components/GoogleIcons/GoogleSearchLogo';
import { Link, useNavigate } from 'react-router-dom';
import Eye from '../components/Eyes/Eye';
import SlashedEye from '../components/Eyes/SlashedEye';

type HasInput = {
    email: boolean,
    password: boolean,
    confirmPassword: boolean
}

type InputValue = {
    email: string,
    password: string,
    confirmPassword: string
}

type EYE = {
    password: {
        show: boolean,
        change: boolean,
    },
    confirmPassword: {
        show: boolean,
        change: boolean,
    }
}

const AuthPage = () => {
    // * Switch between login and signup
    const [isLogin, setIsLogin] = useState<boolean>(true);
    // * To check if the input field has an input
    const [hasInput, setHasInput] = useState<HasInput>({
        email: false,
        password: false,
        confirmPassword: false
    });
    // * States to hold the value of input fields
    const [inputValue, setInputValue] = useState<InputValue>({
        email: '',
        password: '',
        confirmPassword: ''
    });
    // * State to keep track of eye changes, show -> to show the eyes, change -> to change the eyes
    const [eye, setEye] = useState<EYE>({
        password: {
            show: false,
            change: false
        },
        confirmPassword: {
            show: false,
            change: false
        }
    });
    // * Refs to hold reference to DOM
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    // * To change the url when switching between pages
    const navigate = useNavigate();
    // * Css properties for input field which will be added if there are inputs for the field 
    const labelStyle: CSSProperties = {
        top: '-8px',
        backgroundColor: 'white',
        paddingInline: '4px'
    }
    // @func to hanlde blurness of input elements
    // * sets the value for hasInput and changes backgroundColor
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value.length > 0) {
            setHasInput(previous => {
                return { ...previous, [name]: true }
            });
            event.target.style.backgroundColor = 'white';
        } else {
            setHasInput(previous => {
                return { ...previous, [name]: false }
            });
            event.target.style.backgroundColor = 'rgb(107 114 128 / 0.05)'
        }
    };
    // @func changes backgroundColor on focus
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        const field: HTMLInputElement = event.target;
        field.style.backgroundColor = 'white';
    };
    // @func to handle switching between the pages
    const handleSwitch = () => {
        navigate(isLogin ? '/signup' : '/login');
        setIsLogin(!isLogin);
        setInputValue({
            email: '',
            password: '',
            confirmPassword: ''
        });
        setHasInput({
            email: false,
            password: false,
            confirmPassword: false
        });
        setEye({
            password: {
                show: false,
                change: false
            },
            confirmPassword: {
                show: false,
                change: false
            }
        })
        // * Reset the background which was white during focus while changing pages
        if (emailRef.current && passwordRef.current) {
            emailRef.current.style.backgroundColor = 'rgb(107 114 128 / 0.05)';
            passwordRef.current.style.backgroundColor = 'rgb(107 114 128 / 0.05)';
            passwordRef.current.setAttribute('type', 'password');
        }
        if (confirmPasswordRef.current) {
            confirmPasswordRef.current.style.backgroundColor = 'rgb(107 114 128 / 0.05)';
        }
    };
    // @func that handles the password type as password or text
    const showPassword = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            const fieldName = ref.current.name as keyof EYE;
            if (!eye[fieldName].change) {
                ref.current.setAttribute('type', 'text');
                setEye(previous => {
                    return {
                        ...previous,
                        [fieldName]: {
                            show: previous[fieldName].show,
                            change: true
                        }
                    }
                })
            } else {
                ref.current.setAttribute('type', 'password');
                setEye(previous => {
                    return {
                        ...previous,
                        [fieldName]: {
                            show: previous[fieldName].show,
                            change: false
                        }
                    }
                })
            }
            ref.current.focus();
        }
    };
    // @func to handle password change for both the password field
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const passwordValue = event.target.value;
        const fieldName = event.target.name as keyof EYE;
        if (passwordValue.length > 0) {
            setEye(previous => {
                return {
                    ...previous,
                    [fieldName]: {
                        show: true,
                        change: previous[fieldName].change
                    }
                }
            });
        } else {
            setEye(previous => {
                return {
                    ...previous,
                    [fieldName]: {
                        show: false,
                        change: previous[fieldName].change
                    }
                }
            });
        }
        setInputValue(previous => {
            return {
                ...previous,
                [fieldName]: passwordValue
            }
        });
    };
    // * Changing the title of the page based on login and signup
    useEffect(() => {
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        favicon.href = '/favicon.svg';
        document.title = isLogin ? 'Focus - Login to your account' : 'Focus - Create an account';
    }, [isLogin]);
    return (
        <section className='container flex flex-col justify-center items-center'>
            <h2 className='text-white/75 font-medium text-xl tracking-tighter mb-8'>{isLogin ? 'Login' : 'Create Account'}</h2>
            <main className='bg-white rounded-md p-6 w-full max-w-xs text-center'>
                <button type='button' className="flex items-center justify-center w-full p-3 bg-white rounded-sm shadow-md border-2 border-solid border-black/5">
                    <GoogleSearchLogo width='18' height='18' />
                    <span className='text-gray-500 text-xs ml-2 font-medium'>{isLogin ? 'Login with Google' : 'Signup with Google'}</span>
                </button>
                <section className='or text-gray-500/50 my-6 relative flex justify-center'>
                    <p className='text-sm relative z-10 bg-white w-12'>or</p>
                    <hr className='bg-gray-500/50 w-full h-0.5 absolute top-2' />
                </section>
                <form className='flex flex-col gap-4' method='post' onSubmit={(e) => e.preventDefault()}>
                    {/* Common fields */}
                    <section className='email-field flex flex-col relative group'>
                        <label style={hasInput.email ? labelStyle : undefined} htmlFor='email' className='text-gray-500 text-xs absolute top-2 left-2 transition-all group-focus-within:-top-2 group-focus-within:bg-white group-focus-within:px-1 cursor-text'>Email</label>
                        <input type="email" id='email' name='email' autoComplete='off' required className='text-gray-500 text-xs bg-gray-500/5 rounded-sm text-black/50 p-2 border-2 border-solid border-black/10 transition-colors' value={inputValue.email} ref={emailRef} onBlur={(e) => handleBlur(e)} onFocus={(e) => handleFocus(e)}
                            onChange={(e) => setInputValue(previous => {
                                return {
                                    ...previous,
                                    email: e.target.value
                                }
                            })} />
                    </section>
                    <section className='password-field flex flex-col relative group'>
                        <label style={hasInput.password ? labelStyle : undefined} htmlFor='password' className='text-gray-500 text-xs absolute top-2 left-2 transition-all group-focus-within:-top-2 group-focus-within:bg-white group-focus-within:px-1 cursor-text'>Password</label>
                        <input type="password" name='password' id='password' autoComplete='off' required className='text-gray-500 text-xs bg-gray-500/5 rounded-sm text-black/50 p-2 border-solid border-2 border-black/10 transition-colors' value={inputValue.password} onFocus={(e) => handleFocus(e)} onBlur={(e) => handleBlur(e)} onChange={(e) => handlePasswordChange(e)} ref={passwordRef} />
                        {eye.password.show && (eye.password.change ? <SlashedEye changeEye={() => showPassword(passwordRef)} /> : <Eye changeEye={() => showPassword(passwordRef)} />)}
                    </section>
                    {!isLogin && (
                        <section className='confirm-password-field flex flex-col relative group'>
                            <label style={hasInput.confirmPassword ? labelStyle : undefined} htmlFor='confirm-password' className='text-gray-500 text-xs absolute top-2 left-2 transition-all group-focus-within:-top-2 group-focus-within:bg-white group-focus-within:px-1 cursor-text'>Confirm Password</label>
                            <input type="password" name='confirmPassword' id='confirm-password' autoComplete='off' required value={inputValue.confirmPassword} ref={confirmPasswordRef} className='text-gray-500 text-xs bg-gray-500/5 rounded-sm text-black/50 p-2 border-solid border-2 border-black/10 transition-colors' onFocus={(e) => handleFocus(e)} onBlur={(e) => handleBlur(e)}
                                onChange={(e) => handlePasswordChange(e)} />
                            {eye.confirmPassword.show && (eye.confirmPassword.change ? <SlashedEye changeEye={() => showPassword(confirmPasswordRef)} /> : <Eye changeEye={() => showPassword(confirmPasswordRef)} />)}
                        </section>
                    )}
                    <button type="submit" className='text-xs bg-focus p-4 font-medium uppercase hover:opacity-90'>{isLogin ? 'Log in' : 'Sign up'}</button>
                    {isLogin &&
                        <Link to={'/reset-password'} className='text-xs text-gray-500 underline w-max mx-auto my-0'>Forgot Password?</Link>
                    }
                </form>
            </main>
            <footer className='text-center my-4'>
                <p className='text-sm text-white/75'>{isLogin ? `Don't have an account?` : 'Already have an account?'}</p>
                <button type='button' onClick={() => handleSwitch()} className='text-xs underline'>
                    {isLogin ? 'Create Account' : 'Log In'}
                </button>
            </footer>
        </section>
    );
};

export default AuthPage;
