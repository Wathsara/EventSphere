import React, { FunctionComponent, ReactElement } from "react";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display for ID token claim validation failure.
 *
 * @return {React.ReactElement}
 */
export const IssuerClaimValidationFailure: FunctionComponent = (): ReactElement => {

    return (
        <DefaultLayout>
            <h6 className="error-page_h6">
                Issuer claim validation failed!
            </h6>
            <p className="error-page_p">
                The configured BaseURL in config.json might be incorrect. Make sure to remove any
                trailing spaces if present.
            </p>
        </DefaultLayout>
    );
};
