export function lookupFactory(application, name) {
  if (application && application.lookupFactory) {
    return application.lookupFactory(name);
  } else {
    return application.__container__.lookupFactory(name);
  }
}

export function lookup(application, name) {
  if (application && application.lookup) {
    return application.lookup(name);
  } else {
    return application.__container__.lookup(name);
  }
}
