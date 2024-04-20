import React, { FunctionComponent, ReactElement } from "react";
import { DefaultLayout } from "../layouts/default";
import { AsgardeoAuthException } from "@asgardeo/auth-react";

interface VerifyIDTokenFailureProps {
    error?: AsgardeoAuthException;
}

/**
 * Page to display for ID token verifying failures Page.
 *
 * @param {VerifyIDTokenFailureProps} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const VerifyIDTokenFailure: FunctionComponent<VerifyIDTokenFailureProps> =
    ({error}): ReactElement => {

    return (
        <DefaultLayout>
            <h6 className="error-page_h6">
                ID token validation failed!
            </h6>
            <p className="error-page_p">
                Issue occurred while verifying ID token.
            </p>
            <p className="error-page_p">
                Error message : {error?.message}<br />
                Error reason : {error?.name}
            </p>
        </DefaultLayout>
    );
};
