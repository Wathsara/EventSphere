import React, { FunctionComponent, ReactElement, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display Authentication Failure Page.
 *
 * @param {AuthenticationFailureInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticationFailure: FunctionComponent = (): ReactElement => {

  const { signIn } = useAuthContext();
  const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
  
  const handleLogin = () => {
    signIn()
        .catch(() => setHasAuthenticationErrors(true));
  };

  return (
    <DefaultLayout hasErrors={ hasAuthenticationErrors }>
      <div className="content">
          <div className="ui visible negative message">
              <div className="header"><b>Authentication Error!</b></div>
              <p>Please check application configuration and try login again!.</p>
          </div>
          <button className="btn primary" onClick={ handleLogin }>Login</button>
      </div>
    </DefaultLayout>
  );
};
