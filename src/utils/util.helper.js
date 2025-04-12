export function getTokenExpiry(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp ? payload.exp * 1000 : null;
}

export function getToken(key) {
  return null;
}

export async function getHeaders() {
  let token = getToken("token");

  const headers = new Headers({
    accept: "application/json",
  });

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export const isValidApiUrl = (apiUrl) => {
  try {
    const url = new URL(apiUrl);
    const isLocalhost =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (!isLocalhost && url.protocol !== "https:") {
      console.error("URL is not using HTTPS:", apiUrl);
      return false;
    }

    const allowedHostnames = [process.env.REACT_APP_API_HOSTNAME];
    if (!isLocalhost && !allowedHostnames.includes(url.hostname)) {
      console.error("URL hostname is not allowed:", url.hostname);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid URL structure:", apiUrl, error);
    return false;
  }
};

export const parseUrlTemplate = (
  urlTemplateString,
  pathParams,
  queryParams
) => {
  let url = urlTemplateString;
  for (const key in pathParams) {
    url = url.replace(`{${key}}`, pathParams[key].toString() ?? "");
  }
  url = url.replace(/\{\w+\}/g, "");
  if (queryParams) {
    url += "?" + queryParams;
  }
  return url;
};
