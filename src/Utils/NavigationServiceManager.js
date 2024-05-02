import React from "react";

let _navigation;
function setTopLevelNavigation(navigationRef) {
  _navigation = navigationRef;
}
function getTopLevelNavigation() {
  return _navigation;
}
function navigateToSingleRoute(routeName) {
  console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation);

  _navigation.navigate(routeName);
}

function navigateToSpecificRoute(routeName) {
  console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation);

  _navigation.reset({
    routes: [{ name: routeName }],
  });
  console.log("After navigation");
}

function navigateToPage(routeName) {
  console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation);

  _navigation.navigate("anotherUser");
  _navigation.reset({
    routes: [{ name: "anotherUser" }],
  });
}

function navigateToDoubleroot(routeName, params) {
  console.log("Navigation :::::: ", routeName, "  :::::::  ", _navigation);

  _navigation.reset({
    routes: [{ name: "home" }],
  });
  _navigation.navigate(routeName, params);
}

export default {
  setTopLevelNavigation,
  navigateToSpecificRoute,
  navigateToDoubleroot,
  navigateToSingleRoute,
  navigateToPage,
  getTopLevelNavigation
};
