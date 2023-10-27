
# Smart Student


This is a web project I made in a short span of time for a college club induction task.  
It is a college web portal for students where they can view their academic progress and finances.  
When logged in as a student, there are 2 pages - academics and finance. Students can view their grades, overall cgpa and make payments. (Note: all of this is test data and mock payments.)


There is also a professor sign-in, in which professors can assign grades to students.
Complete with a profile page where the user has the abiility to upload custom avatar.


## Tech Stack

The T3 Stack  
- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://typescriptlang.org)
- [Prisma](https://prisma.io)
- [NextAuth.js](https://next-auth.js.org)


## Run Locally

Clone the project

```bash
git clone https://github.com/Shiv-Patil/Smart-Student/
```

Go to the project directory

```bash
cd Smart-Student
```

Install dependencies

```bash
bun install
```

Start the server

```bash
bun run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`  
`NEXTAUTH_URL`  
`NEXTAUTH_SECRET`  
`GOOGLE_CLIENT_ID`  
`GOOGLE_CLIENT_SECRET`  
`UPLOADTHING_SECRET`  
`UPLOADTHING_APP_ID`  
`EMAIL_SERVER_HOST`  
`EMAIL_SERVER_PORT`  
`EMAIL_SERVER_USER`  
`EMAIL_SERVER_PASSWORD`  
`EMAIL_FROM`  
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  
`STRIPE_SECRET_KEY`  
`STRIPE_WEBHOOK_SECRET`


## Demo

Live demo is available at https://smart-student.vercel.app


## License

[MIT](https://choosealicense.com/licenses/mit/)

