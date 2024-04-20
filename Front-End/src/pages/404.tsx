import React, { FunctionComponent, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display for 404.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const NotFoundPage: FunctionComponent = (): ReactElement => {

    const navigate = useNavigate();

    return (
        <DefaultLayout>
            <h3>
                404: Page not found
            </h3>
            <button className="btn primary" onClick={() => { navigate("/home") }}>Go back to home</button>
        </DefaultLayout>
    );
};
