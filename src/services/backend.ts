import axios from 'axios';

type LoginData = {
  Username: string,
  Password: string,
  Type: string,
  LoginType: string,
}

type LoginResponse = {
  AccessToken: string
}

type DataQueryHeaders = {
  Authorization: string,
}

/*
  TODO: later this can be refactored to separate login function, which securely stores the AccessToken for further query
  for getting the actual data.

  Also, return type is any for
*/
export async function getData() {
  const loginData: LoginData = {
    Username: import.meta.env.VITE_ASSISCARE_USER,
    Password: import.meta.env.VITE_ASSISCARE_PASS,
    Type: "Api",
    LoginType: "Rest"
  }
  try {
    const { data } = await axios.post<LoginResponse>(`${import.meta.env.VITE_ASSISCARE_BASE}${import.meta.env.VITE_ASSISCARE_ROUTE}login`, loginData);
    if (data.AccessToken) {
      // TODO store AccessToken?
      const accessToken = data.AccessToken;
      try {
        const headers: DataQueryHeaders = { Authorization: `Bearer ${accessToken}` }
        
        // TODO typing (reference: DtoSchema in sample cs project. Very heavy typing, has to be done later)
        const { data } = await axios.get(`${import.meta.env.VITE_ASSISCARE_BASE}${import.meta.env.VITE_ASSISCARE_ROUTE}dack/schema`, {
          headers,
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(`error at getSchema: ${error.message}`);
        } else {
          console.log(`unknown error at login: ${error}`);
        }
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`error at login: ${error.message}`);
    } else {
      console.log(`unknown error at login: ${error}`);
      
    }
  }
}

export async function getOrganizationName() {
  const { data } = await axios.get(`${import.meta.env.VITE_ASSISCARE_BASE}${import.meta.env.VITE_ASSISCARE_ROUTE}organization`);
  return data.json();
}