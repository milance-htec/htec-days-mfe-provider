import { useEffect } from "react";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";

import useReefCloud from "../reef-cloud.hook";

export default function HandleCallback() {
  const { getTokens } = useReefCloud();
  const { search } = useLocation();
  const { replace } = useHistory();
  const parsedQuery = queryString.parse(search);

  useEffect(() => {
    const getTokensHandler = async () => {
      await getTokens(parsedQuery.code as string);

      let state: any = {};
      if (parsedQuery.state) {
        state = JSON.parse(atob(parsedQuery.state as string));
      }

      if (state["ref_url"]) {
        window.location.replace(state["ref_url"]);
      } else {
        window.location.replace("/");
      }
    };

    getTokensHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
