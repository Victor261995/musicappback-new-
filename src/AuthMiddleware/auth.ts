import jwt from'jsonwebtoken';
import bcrypt from'bcrypt';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const Password='passwordtoken';

export const generateToken=(user: { id: any; email: any; })=>{
const payload={
id: user.id,
email:user.email,

};

return jwt.sign(payload,Password,{expiresIn:'3D'});

};

export const verifyToken=(token: any)=>{
try{
return jwt.verify(token,Password);


}catch(error){

return null;

 }

};

export const comparePasswords=async(plainPassword: any,hashedPassword: string)=>{

return await bcrypt.compare(plainPassword,hashedPassword);

}


interface CustomHeaders extends Headers {
   
    authorization?: string;
  };


