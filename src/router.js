import React from "react";
import { Switch, Route } from "react-router-dom";
import Page_1 from "./Components/Page/Page_1/Page_1";
import Page_2 from "./Components/Page/Page_2/Page_2";
import Transfer from "./Components/Page/Transfer/trasnfer";
import Vote from "./Components/Page/Vote/vote";
import Pattern from "./Components/Page/Pattern/pattern";


const Routers = () => {
	return (
	<Switch>
		<Route path="/" component={Page_1} exact />
		<Route path="/Page 1" component={Page_1} exact />
		<Route path="/Page 2" component={Page_2} exact />
		<Route path="/Transfer" component={Transfer} exact />
		<Route path="/Vote" component={Vote} exact />
		<Route path="/Pattern" component={Pattern} exact />
	</Switch>);};
export default Routers;