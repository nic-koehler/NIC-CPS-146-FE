import React, { useEffect, useState, FormEvent } from 'react';
import ReactGA from 'react-ga';

interface VerifyProps {
  match: {
    params: {
      token: string
    }
  }
}

function MySQLAccountVerify(props: VerifyProps) {
  const [operation, setOperation] = useState( 'Create' );
  const [email, setEmail] = useState( '' );
  const [password, setPassword] = useState( '' );
  const [disableButton, setDisableButton] = useState( false );
  const [completed, setCompleted] = useState( false );
  const [alertType, setAlertType] = useState( 'success' );
  const [message, setMessage] = useState( 'OK' );

  let formDivClass = 'col-md-12 order-md-1';
  let alertClass = `d-none alert alert-${alertType}`;
  if ( completed ) {
    formDivClass = 'd-none col-md-12 order-md-1';
    alertClass = `alert alert-${alertType}`;
  }

  useEffect(()=>{
    fetch( process.env.REACT_APP_BACKEND_URL +
      '/requests/' +
      props.match.params.token )
    .then( (response: any) => response.json() )
    .then( (data: any) => {
      console.log( data );
      if ( data.message.startsWith( 'Invalid') ) {
        setMessage( data.message );
        setAlertType( 'danger' );
        setCompleted( true );
      } else
        setEmail( data.email );
        if ( data.message === 'update' ) {
          setOperation( 'Update' );
        }
    })
    .catch( (err: any) => {
      console.log( "There was a problem fetching the account request.");
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLFormElement;
      if ( element.checkValidity() ) {
        ReactGA.event({
          category: "Account",
          action: operation,
        });
        setDisableButton( true );
        element.classList.remove('was-validated');
        fetch(
          process.env.REACT_APP_BACKEND_URL + '/accounts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
              password,
              token: props.match.params.token
            } )
          }
        )
        .then( (response: any) => response.json() )
        .then( (data: any) => {
          setMessage( data.message );
          setPassword('');
          setCompleted( true );
        })
        .catch( (err: any) => {
          console.log( "There was a problem creating a new account request.");
        });
      } else {
        element.classList.add('was-validated');
      }
  }

  return (
    <div>
      <div className="py-5">
        <h2>{operation} MySQL Account</h2>
        <p>For account: {email}.</p>
      </div>

      <div className="row">
        <div className={formDivClass}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password"
                  value={password} onChange={e => setPassword( e.target.value )}
                  required />
                <div className="invalid-feedback">
                  A password is required.
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-block"
                    disabled={disableButton}
                    type="submit">{operation} MySQL Account</button>
          </form>
        </div>
        <div className={alertClass} role="alert">
          {message}
        </div>
      </div>

    </div>
  );
}

export default MySQLAccountVerify;
