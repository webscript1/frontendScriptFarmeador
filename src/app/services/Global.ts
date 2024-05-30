export const Global={
 //url:'https://scripfarmeador.onrender.com/',
 //url:'https://scripfarmeador-1.onrender.com/',
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
  },

  setIdInstancia:(id:string)=>{
    localStorage.setItem('idinstancia',id)
  },
  getIdInstancia:()=>{
   return localStorage.getItem('idinstancia')
  }
}