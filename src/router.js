import React from "react";
import { Switch, Route } from "react-router-dom";
import Authorization from "./Components/Page/Authorization/Authorization";
import Registration from "./Components/Page/Registration/Registration";
import Transfer from "./Components/Page/Transfer/trasnfer";
import Vote from "./Components/Page/Vote/vote";
import Pattern from "./Components/Page/Pattern/pattern";


const Routers = () => {
	return (
	<Switch>
		<Route path="/" component={Authorization} exact />
		<Route path="/Authorization" component={Authorization} exact />
		<Route path="/Registration" component={Registration} exact />
		<Route path="/Transfer" component={Transfer} exact />
		<Route path="/Vote" component={Vote} exact />
		<Route path="/Pattern" component={Pattern} exact />
	</Switch>);};
export default Routers;