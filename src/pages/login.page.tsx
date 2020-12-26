import React, { useEffect } from "react";
import useReefCloud from "../reef-cloud.hook";
import { useLocation, useHistory } from "react-router-dom";

export default function Login() {
  const { authState, loading, login } = useReefCloud();
  const { state } = useLocation();
  const { replace } = useHistory();
  useEffect(() => {
    if (!loading) {
      if (!!authState) {
        replace("/");
      } else {
        //@ts-ignore
        login({ ref_url: state?.referrer || "/" });
      }
    }
  }, [authState, loading]);
  return null;
}
