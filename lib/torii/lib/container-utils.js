export function registerFactory(container, factoryName, factory) {
  container.register(factoryName, factory);
}
