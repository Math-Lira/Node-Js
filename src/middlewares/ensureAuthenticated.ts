import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Ipayload {
  sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next:NextFunction) {
  
  //Receber o token
  const authtoken = request.headers.authorization

  //Validar se token está preenchido
  if(!authtoken) {
    return response.status(401).end();
  }

  const [,token] = authtoken.split(" ");

  //Validar se token e válido
  try {
    const { sub } = verify(token, "e24f515ff5657bea26de05d5bff473b8") as Ipayload;
    
    //Recuperar informações do usúario
    request.user_id = sub
    
    return next();
  }catch (err) {
    return response.status(401).end();
  }


}
