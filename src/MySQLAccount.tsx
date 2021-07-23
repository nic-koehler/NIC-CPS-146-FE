import React, { useState, FormEvent } from 'react';
import ReactGA from 'react-ga';
import {
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

interface Request {
  email: string,
};

function MySQLAccount() {
  const [email, setEmail] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [completed, setCompleted] = useState( false );
  const [disableButton, setDisableButton] = useState( false );

  let formDivClass = 'col-md-12 order-md-1';
  let alertClass = 'd-none alert alert-success';
  if ( completed ) {
    formDivClass = 'd-none col-md-12 order-md-1';
    alertClass = 'alert alert-success';
  }

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLFormElement;
      if ( element.checkValidity() ) {
        ReactGA.event({
          category: "Request",
          action: "Add",
        });
        setDisableButton( true );
        let token = '';
        if ( executeRecaptcha ) {
          token = await executeRecaptcha!( 'request' );
        } else {
          console.log( 'executeRecaptcha not yet available' );
        }
        element.classList.remove('was-validated');
        fetch(
          process.env.REACT_APP_BACKEND_URL + '/requests',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( {email, token} )
          }
        )
        .then( (response: any) => response.json() )
        .then( (data: any) => {
          console.log( data );
          setEmail('');
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
        <h2>MySQL Account</h2>
        <p>You must enter a valid "@nic.bc.ca" or "@northislandcollege.ca"
           email address. You will be emailed a link that will
           allow you to create a new MySQL account, or reset the
           password if an account already exists for your
           email address.</p>
      </div>

      <div className="row">
        <div className={formDivClass}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email"
                  value={email} onChange={e => setEmail( e.target.value )}
                  required
                  pattern=".+@nic\.bc\.ca|.+@northislandcollege\.ca|.+@koehler.ca" />
                <div className="invalid-feedback">
                  A valid email address is required.
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-block"
                    disabled={disableButton}
                    type="submit">Request MySQL Account</button>
          </form>
        </div>
        <div className={alertClass} role="alert">
          Check your email for a link and further instructions.
        </div>
      </div>

    </div>
  );
}

export default MySQLAccount;
