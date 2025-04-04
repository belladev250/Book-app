import { DateResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import fs from 'fs/promises'
import path from 'path'
import bcryptjs from 'bcryptjs'
import { SignJWT } from 'jose'
import { Blob } from 'buffer'
import prisma from '@/lib/prisma'
import dotenv from 'dotenv';
dotenv.config();


const APP_SECRET = process.env.APP_SECRET
console.log('Loaded APP_SECRET:', process.env.APP_SECRET); 

console.log("APP_SECRET:", APP_SECRET);  // Debugging
if (!APP_SECRET) {
  throw new GraphQLError('APP_SECRET is not set in the environment variables.');
}



export const resolvers = {
 Date: DateResolver,
 Query: {
  userBooks: (_, args, context) => {
   const {collection} = args
   const {userId} = context
   return prisma.book.findMany({where: {userId, collection}})
  },
  userBook: async (_, args, context) => {
   const {bookId} = args
   const {userId} = context
   const userBookRow = await prisma.book.findFirst({where: {userId, bookId: parseInt(bookId, 10)}})
   if (userBookRow) {
    return userBookRow
   }
   throw new GraphQLError('Selected Book does not belong to you')
  },
 },
 Mutation: {
  addBook: async (_, args, context) => {
   const {title, author, file, date, collection} = args
   const {userId} = context
   let fileName = ''
   try {
    if (file) {
     const {name, type, blobParts} = await file
     fileName = name
     const filePath = path.join(process.cwd(), 'public', 'uploads', name)
     const blob = new Blob(blobParts, {
      type
     })

     const buffer = Buffer.from(await blob.arrayBuffer())
     await fs.writeFile(filePath, buffer)
    }
   } catch (e) {
    console.log(e)
   }

   return prisma.book.create({data: {title, author, date: new Date(date), collection, userId, cover: fileName}})
  },
  modifyBook: async (_, args, context) => {
   const {bookId, title, author, file, date, collection, rating} = args
   const {userId} = context
   const existingRow = await prisma.book.findFirst({where: {userId, bookId: parseInt(bookId, 10)}})
   if (!existingRow) {
    return null
   }
   let fileName = existingRow.cover || ''

   try {
    if (file) {
      const { name, type, blobParts } = await file;
      fileName = `${Date.now()}_${name}`; // Unique name to prevent conflicts
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
      const buffer = Buffer.concat(blobParts.map(part => Buffer.from(part))); // Directly process
      await fs.writeFile(filePath, buffer);
    }
    
   } catch (e) {
    console.log(e)
   }

   return prisma.book.update({
    where: {bookId: parseInt(bookId, 10)},
    data: {title, author, date: new Date(date), collection, rating, cover: fileName}
   })
  },
  

  signup: async (_, args) => {
    const { name, username, password } = args;
  
    const existingRow = await prisma.user.findFirst({ where: { username } });
  
    if (existingRow) {
      throw new GraphQLError('Username already exists, Choose a new one.');
    }
  
    const user = await prisma.user.create({
      data: {
        username,
        password: bcryptjs.hashSync(password, 8),
        name,
      },
    });
  
    console.log("New User Created:", user);  // Debugging
  
    if (!user || !user.userId) {
      throw new GraphQLError("Error: User ID is undefined.");
    }
  
    const token = await new SignJWT({ userId: user.userId })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('999h')
  .sign(new TextEncoder().encode(APP_SECRET)); // Ensure APP_SECRET is not undefined

  
    return {
      token,
      user,
    };
  },
  
   

 
  login: async (_, args) => {
   const {username, password} = args

   const userRow = await prisma.user.findFirst({where: {username}})

   if (!userRow) {
    throw new GraphQLError('Username not found')
   }

   const valid = await bcryptjs.compare(password, userRow.password)
   if (!valid) {
    throw new GraphQLError('Invalid password')
   }

   const token = await new SignJWT({userId: userRow.userId})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('999h')
    .sign(new TextEncoder().encode(APP_SECRET))

   return {
    token,
    user: userRow,
   }
  },
 }
}

