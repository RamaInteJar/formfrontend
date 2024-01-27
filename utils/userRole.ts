export const checkUserRole = (access_token: string | null) => {
  // Split the token into header, payload, and signature
  if (access_token) {
    const [header, payload, signature] = access_token.split('.');

    // Decode the Base64-encoded parts
    const decodedHeader = atob(header);
    const decodedPayload = atob(payload);

    // Parse the JSON data in the decoded parts
    const parsedHeader = JSON.parse(decodedHeader);
    const parsedPayload = JSON.parse(decodedPayload);

    // Create an object containing the decoded header, payload, and signature
    const decodedToken = {
      payload: parsedPayload.role,
    };

    if (decodedToken.payload === 'admin') {
      return true;
    }

    return false;
  }
};
