import React from "react";

import {listItem} from "@/utils/routerRender";
import Home from "../pages/home";
import Page404 from "../pages/page404";

export const routers: listItem[] = [
    {
        path: "/",
        exact: true,
        component: Home,
    },
    {
        path: "/replace",
        redirect: "/",
    },
    {
        component: Page404
    }
]