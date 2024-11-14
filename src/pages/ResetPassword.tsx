import { CSSProperties, FocusEvent, useState } from "react"
import { Link } from "react-router-dom"

const ResetPassword = () => {
    const [hasInput, setHasInput] = useState(false);
    const [email, setEmail] = useState('');
    // * Css properties for input field which will be added if there are inputs for the field 
    const labelStyle: CSSProperties = {
        top: '-8px',
        backgroundColor: 'white',
        paddingInline: '4px'
    }
    // @func to hanlde blurness of input elements
    // * sets the value for hasInput and changes backgroundColor
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        if (value.length > 0) {
            setHasInput(true);
            event.target.style.backgroundColor = 'white';
        } else {
            setHasInput(false);
            event.target.style.backgroundColor = 'rgb(107 114 128 / 0.05)'
        }
    };
    // @func changes backgroundColor on focus
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        const field: HTMLInputElement = event.target;
        field.style.backgroundColor = 'white';
    };
    return (
        <section className='container flex flex-col justify-center items-center'>
            <h2 className='text-white/75 font-medium text-xl tracking-tighter mb-8'>Reset Password</h2>
            <main className='bg-white rounded-md p-6 w-full max-w-xs text-center'>
                <form className='flex flex-col gap-4' method='post' onSubmit={(e) => e.preventDefault()}>
                    {/* Common fields */}
                    <section className='email-field flex flex-col relative group'>
                        <label style={hasInput ? labelStyle : undefined} htmlFor='email' className='text-gray-500 text-xs absolute top-2 left-2 transition-all group-focus-within:-top-2 group-focus-within:bg-white group-focus-within:px-1 cursor-text'>Email</label>
                        <input type="email" id='email' name='email' autoComplete='off' required className='text-gray-500 text-xs bg-gray-500/5 rounded-sm text-black/50 p-2 border-2 border-solid border-black/10 transition-colors' value={email} onBlur={(e) => handleBlur(e)} onFocus={(e) => handleFocus(e)}
                            onChange={(e) => setEmail(e.target.value)} />
                    </section>
                    <button type="submit" className='text-xs bg-focus p-4 font-medium uppercase hover:opacity-90'>Reset Password</button>
                </form>
            </main>
            <footer className='text-center my-4'>
                <p className="text-sm text-white/75">Try other methods?</p>
                <Link to={'/login'} className='text-xs underline'>Login</Link>
            </footer>
        </section>
    )
}
export default ResetPassword