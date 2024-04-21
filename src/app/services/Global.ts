export const Global={
//url:'https://elscriptfarmeador.onrender.com/',
 url:`http://localHost:3001/`,
  url_version:'v1',
  token: (): string | null=> {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('token');
        }
        return null;
      },
  removeToken:()=>{
    localStorage.removeItem('token')
  }
}