import {useState} from 'react'
import {register} from '../services/auth'
import axios from 'axios'

const Register=({setFocus})=>{

    const [form,setForm]=useState({user_name:'',email:'',password:'',confirm_password:''})
    const handleChange=(e)=>{setForm({...form,[e.target.name]:e.target.value})}
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const portfolio=await axios.post(`${process.env.REACT_APP_POSTGRESQL_DB}/api/portfolio/create`)
        console.log(portfolio.data.id,form)
        await register({
            user_name:form.user_name,
            email:form.email,
            initialPassword:form.password,
            portfolios:[portfolio.data.id]
        })
        setForm({user_name:'',email:'',password:'',confirm_password:''})
        setFocus('login')
    }

    return(
        <div id='register'>
            <div id='switch-auth-wrapper' style={{marginTop:'9%'}}>
                <div>Already have an account?</div>
                <button onClick={(e)=>{setFocus('login')}} id='sign-up'>
                    Sign In.
                </button>
            </div>
            <div id='auth-form-wrapper'>
                <div id='register-form'>
                    <div id='auth-input-wrapper'>User Name
                        <input
                            onChange={handleChange}
                            name='user_name'
                            type='user_name'
                            placeholder=''
                            value={form.value}
                            required
                        />
                    </div>
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
                    <div id='auth-input-wrapper'>Password
                        <input
                            onChange={handleChange}
                            name='password'
                            type='password'
                            placeholder=''
                            value={form.value}
                            required
                        />
                    </div>
                    <div id='auth-input-wrapper'>Confirm Password
                        <input
                            onChange={handleChange}
                            name='confirm_password'
                            type='confirm_password'
                            placeholder=''
                            value={form.value}
                            required
                        />
                    </div>
                </div>
                <button 
                    id='auth-button'
                    onClick={(e)=>{handleSubmit(e)}}
                    disabled={!form.email||!form.password}>
                    Create Free Account
                </button>
            </div>
        </div>
    )
}
export default Register