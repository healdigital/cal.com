type EndpointPath = {
  endpoint: string;
  path: string;
};

const ROOT_ROUTER_ENDPOINTS: ReadonlySet<string> = new Set(["thotis"]);

function getEndpointPath(opPath: string): EndpointPath {
  const parts = opPath.split(".");

  if (parts.length === 2) {
    return {
      endpoint: parts[0],
      path: parts[1],
    };
  }

  if (ROOT_ROUTER_ENDPOINTS.has(parts[0])) {
    return {
      endpoint: parts[0],
      path: parts.slice(1).join("."),
    };
  }

  return {
    endpoint: parts[1],
    path: parts.slice(2).join("."),
  };
}

export { getEndpointPath };
