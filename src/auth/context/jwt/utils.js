
import axios from 'src/utils/axios';


export const setSession = (jwt, jwtRefresh) => {
  if (jwt && jwtRefresh) {
    sessionStorage.setItem('jwt', jwt);
    sessionStorage.setItem('jwtRefresh', jwtRefresh);

    axios.defaults.headers.common.AUTH_JWT = jwt;
    axios.defaults.headers.common.AUTH_JWT_REFRESH = jwtRefresh;

  } else {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('jwtRefresh');

    delete axios.defaults.headers.common.AUTH_JWT;
    delete axios.defaults.headers.common.AUTH_JWT_REFRESH;
  }
};
