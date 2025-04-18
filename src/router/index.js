import { createRouter, createWebHistory } from "vue-router";
import Register from "@/components/auth/Register.vue";
import Login from "@/components/auth/Login.vue";
import ForgotPassword from "@/components/auth/ForgotPassword.vue";
import Dashboard from "@/components/admin/Dashboard.vue";
import Account from "@/components/admin/Account.vue";
import Movies from "@/components/admin/Movie/Movies.vue";
import Transactions from "@/components/admin/Transactions.vue";
import user from "@/components/admin/user.vue";
import setting from "@/components/admin/Setting.vue";
import VIPManagement from "@/components/admin/VIPManagement.vue";
import AddMovie from "@/components/AddMovie.vue";
import Actors from "@/components/admin/Movie/Actors.vue";
import Categories from "@/components/admin/Movie/Categories.vue";
import Directors from "@/components/admin/Movie/Directors.vue";


const routes = [{
    path: "/register",
    name: "register",
    component: Register
},
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/forgotpassword",
        name: "forgotpassword",
        component : ForgotPassword
    },
    {
        path: "/admin",
        name: "dasboard",
        component: Dashboard
    },
    {
        path: "/admin/movies",
        name: "movies",
        component: Movies
    },
    {
        path: "/admin/account",
        name: "account",
        component: Account
    },
    {
        path: "/admin/transactions",
        name: "transactions",
        component: Transactions
    },
    {
        path: "/admin/user",
        name: "user",
        component: user
    },
    {
        path: "/admin/setting",
        name: "setting",
        component: setting
    },
    {
        path: "/admin/vipmanagenment",
        name: "vipmanagenment",
        component: VIPManagement
    },
    {
        path: "/admin/add",
        name: "AddMovie",
        component: AddMovie
    },
    {
        path: "/admin/actors",
        name: "Actors",
        component: Actors
    },
    {
        path: "/admin/categories",
        name: "Categories",
        component: Categories
    },
    {
        path: "/admin/directors",
        name: "Directors",
        component: Directors
    },
    

    
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
