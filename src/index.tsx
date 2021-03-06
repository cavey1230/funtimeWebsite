import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "@/config/reduxStoreConfig";

//react keepAlive
import {AliveScope} from 'react-activation';

ReactDOM.render(
    <Provider store={store()}>
        <HashRouter>
            <AliveScope>
                <App/>
            </AliveScope>
        </HashRouter>
    </Provider>
    , document.getElementById('root')
);