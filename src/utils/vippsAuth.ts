import axios from "axios";

export const VIPPS_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_VIPPS_CLIENT_ID || "",
  redirectUri: process.env.NEXT_PUBLIC_VIPPS_REDIRECT_URI || "",
  scope: process.env.NEXT_PUBLIC_VIPPS_SCOPE || "",
  apiSubscriptionKey: process.env.NEXT_PUBLIC_VIPPS_API_SUBSCRIPTION_KEY || "",
  apiSubscriptionKeySecondary:
    process.env.NEXT_PUBLIC_VIPPS_API_SUBSCRIPTION_KEY_SECONDARY || "",
  authEndpoint: "https://api.vipps.no/access-management-1.0/access/oauth2/auth",
  tokenEndpoint:
    "https://api.vipps.no/access-management-1.0/access/oauth2/token",
  userInfoEndpoint: "https://api.vipps.no/vipps-userinfo-api/userinfo",
  clientSecret: process.env.NEXT_PUBLIC_VIPPS_CLIENT_SECRET || "",
};

export const generateState = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const storeState = (state: string): void => {
  try {
    localStorage.setItem("vippsAuthState", state);
    console.log("State stored successfully:", state);
  } catch (error) {
    console.error("Failed to store state in localStorage:", error);
  }
};

export const getVippsLoginUrl = (): string => {
  const state = generateState();
  storeState(state);

  // Build URL with parameters directly
  const authUrl = new URL(VIPPS_CONFIG.authEndpoint);
  authUrl.searchParams.append("client_id", VIPPS_CONFIG.clientId);
  authUrl.searchParams.append("redirect_uri", VIPPS_CONFIG.redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", VIPPS_CONFIG.scope);
  authUrl.searchParams.append("state", state);

  const fullUrl = authUrl.toString();

  console.log("=== Vipps Login URL Generation ===");
  console.log("Generated state:", state);
  console.log("Redirecting to:", fullUrl);
  console.log("URL parameters:", {
    clientId: VIPPS_CONFIG.clientId,
    redirectUri: VIPPS_CONFIG.redirectUri,
    responseType: "code",
    scope: VIPPS_CONFIG.scope,
    state: state,
  });

  // Check if state was properly stored
  const verifyState = localStorage.getItem("vippsAuthState");
  console.log("Verifying state was stored:", verifyState);

  return fullUrl;
};

// Parse hash or search parameters from URL
export const parseUrlParams = (url: string): URLSearchParams => {
  try {
    console.log("Parsing URL parameters from:", url);
    const parsedUrl = new URL(url);

    // Check for hash parameters (e.g. #code=xyz)
    if (parsedUrl.hash) {
      console.log("Found hash parameters:", parsedUrl.hash);
      return new URLSearchParams(parsedUrl.hash.substring(1));
    }

    // Check for query parameters (e.g. ?code=xyz)
    console.log("Using query parameters:", parsedUrl.search);
    return new URLSearchParams(parsedUrl.search);
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
    return new URLSearchParams();
  }
};

export const exchangeCodeForTokens = async (code: string): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", VIPPS_CONFIG.redirectUri);
    params.append("client_id", VIPPS_CONFIG.clientId);

    const response = await axios.post(VIPPS_CONFIG.tokenEndpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Ocp-Apim-Subscription-Key": VIPPS_CONFIG.apiSubscriptionKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string): Promise<any> => {
  try {
    const response = await axios.get(VIPPS_CONFIG.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Ocp-Apim-Subscription-Key": VIPPS_CONFIG.apiSubscriptionKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const storeTokens = (tokens: any): void => {
  localStorage.setItem("vippsAccessToken", tokens.access_token);
  localStorage.setItem("vippsIdToken", tokens.id_token);
  localStorage.setItem("vippsRefreshToken", tokens.refresh_token || "");
  localStorage.setItem(
    "vippsTokenExpiresAt",
    (Date.now() + tokens.expires_in * 1000).toString()
  );
};

export const isVippsAuthenticated = (): boolean => {
  const expiresAt = localStorage.getItem("vippsTokenExpiresAt");
  const accessToken = localStorage.getItem("vippsAccessToken");
  const userInfo = localStorage.getItem("vippsUserInfo");

  const isAuthenticated =
    !!accessToken &&
    !!expiresAt &&
    !!userInfo &&
    Date.now() < parseInt(expiresAt);

  return isAuthenticated;
};

export const logoutVipps = (): void => {
  localStorage.removeItem("vippsAccessToken");
  localStorage.removeItem("vippsIdToken");
  localStorage.removeItem("vippsRefreshToken");
  localStorage.removeItem("vippsTokenExpiresAt");
  localStorage.removeItem("vippsAuthState");
  localStorage.removeItem("vippsUserInfo");
};
