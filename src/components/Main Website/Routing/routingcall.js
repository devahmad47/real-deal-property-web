import {useRoutes} from "react-router-dom";
import { ThemeRoutePage } from "./Routing";
export const RoutingCallWeb = () => {
    
  const routingPage = useRoutes(ThemeRoutePage);

  return <div >{routingPage}</div>;
};

