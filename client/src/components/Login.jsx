import {useState} from 'react'
import {logIn} from '../services/auth'

const Login=({setFocus,setInvestor,toggleAuthenticated})=>{

    const [form,setForm]=useState({email:'',password:''})
    const handleChange=(e)=>{setForm({...form,[e.target.name]:e.target.value})}
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const payload=await logIn({email:form.email,passwordInput:form.password})
        setForm({email:'',password:''})
        setInvestor(payload)
        toggleAuthenticated(true)
        setFocus('dashboard')
    }

    return(
        <div id='login'>
            <div id='switch-auth-wrapper'>
                <div>Don't have an account?</div>
                <button onClick={(e)=>{setFocus('register')}} id='sign-up'>
                    Sign Up.
                </button>
            </div>
            <div id='login-form-icon'></div>
            <div id='auth-form-wrapper-login'>
                <div className='login-input'>
                    <div id='auth-input-wrapper'>Email
                        <input
                            onChange={handleChange}
                            name='email'
                            type='email'
                            placeholder=''
                            value={form.value}
                            required
                        />
                    </div>
                    <div clasName='login-input' id='auth-input-wrapper'>Password
                        <input
                            onChange={handleChange}
                            name='password'
                            type='password'
                            placeholder=''
                            value={form.value}
                            required
                        />
                    </div>
                </div>
                <button 
                    className='login-button'
                    id='auth-button'
                    onClick={(e)=>{handleSubmit(e)}}
                    disabled={!form.email||!form.password}>
                    Log In
                </button>
            </div>
        </div>
    )
}
export default Login