import React, { useState } from 'react'
import { useRegisterMutation } from './../generated/graphql';

interface Props {

}


export const Register: React.FC<Props> = () => {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ register ] = useRegisterMutation();

    return (
      <div>
        <form onSubmit={async e => {
          e.preventDefault()
          const response = await register({
            variables: {
              email,
              password
            }
          })

          console.log(response);
        }}>
          <div>
              <input
                value={email}
                placeholder="email"
                onChange={e => {
                  setEmail(e.target.value)
                }}
                />
          </div>

          <br/>

          <div>
              <input
                value={password}
                placeholder="password"
                type="password"
                onChange={e => {
                  setPassword(e.target.value)
                }}
                />
          </div>

          <br/>
          <button type="submit">Register</button>


        </form>
      </div>
    )
}
