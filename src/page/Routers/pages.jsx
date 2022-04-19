import PageErr from '../404/PageErr';
import Auth from '../Auth/Auth.jsx';
import Home from '../Home/Home.jsx';
import { RoutesString } from './routesString';

const pages = [
  {
    path: RoutesString.PageNotFound,
    component: PageErr,
    exact: true,
  },

  // /* Home */
  {
    path: RoutesString.Home,
    component: Home,
    exact: true,
  },
  // /* Login */
  {
    path: RoutesString.Auth,
    component: Auth,
    exact: true,
  },

  // /* Teams */
  // {
  //   path: RoutesString.Teams,
  //   component: Teams,
  //   exact: true,
  // },

  // /* Contacts */
  // {
  //   path: RoutesString.Contacts,
  //   component: Contacts,
  //   exact: true,
  // },
];

export default pages;
