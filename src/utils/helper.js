import { getHeaders, isValidApiUrl, parseUrlTemplate } from "./util.helper";

export async function getData(apiUrl, pathParams = {}, queryParams) {
  if (!isValidApiUrl(apiUrl) || !areValidParams(pathParams, queryParams)) {
    return { statusCode: 422, message: "Invalid API request parameters" };
  }
  const headers = await getHeaders();
  const queryString = new URLSearchParams({
    ...queryParams,
  }).toString();

  const url = parseUrlTemplate(apiUrl, pathParams, queryString);

  try {
    let response = await fetch(url, {
      method: "GET",
      headers,
    });
    return await response.json();
  } catch (err) {
    console.error("Error fetching data:", err?.message);
    return { statusCode: 422, message: "Failed to fetch data" };
  }
}

export const areValidParams = (pathParams, queryParams) => {
  for (const key in pathParams) {
    const value = pathParams[key];
    if (typeof value !== "string" && typeof value !== "number") {
      console.error(`Invalid path parameter type for ${key}: ${typeof value}`);
      return false;
    }
    if (typeof value === "string" && value.includes(" ")) {
      console.error(`Path parameter contains spaces for ${key}: ${value}`);
      return false;
    }
  }
  if (queryParams) {
    for (const key in queryParams) {
      const value = queryParams[key];
      if (typeof value !== "string") {
        console.error(
          `Invalid query parameter type for ${key}: ${typeof value}`
        );
        return false;
      }
      if (/[^a-zA-Z0-9-_. ()]/.test(value)) {
        console.error(
          `Query parameter contains invalid characters for ${key}: ${value}`
        );
        return false;
      }
    }
  }

  return true;
};
