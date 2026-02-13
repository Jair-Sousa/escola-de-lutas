import { router } from "./router/router.js";
import "./style/index.css";
import "./style/home.css";
import "./style/login.css";
import "./style/admin.css";
import "./style/signup.css";

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
