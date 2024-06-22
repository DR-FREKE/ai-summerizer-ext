/** utility function to make request */
export const makeRequest = async (url: string, method?: string, body?: any) => {
  const res = await fetch(url);
  if (res.ok) {
    // return the data
    return await res.json();
  } else {
    const error_details = await res.text();
    throw new Error(`Request failed with status ${res.status}`);
  }
};

export const formatSlug = (input: string) => {
  if (!input) return ""; // Handle cases where input is undefined or null
  return input.replace(/:/g, "").replace(/\s/g, "-").replace(/&/g, "and").toLowerCase();
};
