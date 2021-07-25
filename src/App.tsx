import React from "react";
import {bindEffect, RouterRender} from "./utils/routerRender";
import {RouteComponentProps, withRouter} from "react-router-dom";

import "@/assets/reset.css";
import "@/assets/publicAnimation.less";
import "./App.less";

const App: React.FC<RouteComponentProps> = () => {

    return (
        <div className="app-pad">
            <div className="navbar-pad">
                111
            </div>
            <div className="home-pad">
                <div
                    className="scroll-pad"
                    id="scroll"
                >
                    <div className="inner-pad">
                        <RouterRender type="root"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(bindEffect(App))
