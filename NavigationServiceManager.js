import React from "react";

let _navigation;
function setTopLevelNavigation(navigationRef) {
  _navigation = navigationRef;
}

function navigateToSingleRoute(routeName) {
  // console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation)

  _navigation.navigate(routeName);
}

function navigateToSpecificRoute(routeName) {
  // console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation)

  _navigation.reset({
    routes: [{ name: routeName }],
  });
  //   console.log("After navigation");
}

function navigateToDoubleroot(routeName) {
  // console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation)

  _navigation.reset({
    routes: [{ name: "home" }],
  });
  _navigation.navigate(routeName);
}

export default {
  setTopLevelNavigation,
  navigateToSpecificRoute,
  navigateToDoubleroot,
  navigateToSingleRoute,
};
