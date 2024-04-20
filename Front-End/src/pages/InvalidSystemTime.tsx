import React, { FunctionComponent, ReactElement } from "react";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display for Invalid System Time Page.
 *
 * @param {InvalidSystemTimePagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InvalidSystemTimePage: FunctionComponent = (): ReactElement => {

  return (
    <DefaultLayout>
      <h6 className="error-page_h6">
          Your Clock is Invalid !
      </h6>
      <p className="error-page_p">
          It looks like your computer&rsquo;s date and time is incorrect. Please validate and try again
      </p>
    </DefaultLayout>
  );
};
