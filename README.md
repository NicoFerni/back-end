# Back-end project

This is a freelance project that I'm currently building. 
I developed the backend for an API that users will be able to sign in to on a platform (https://programadoresweb.netlify.app/). This page is a talent pool where programmers can make their own profiles and offer their services.
I have implement methods to create a profile and manipulate the data to be consumed in the front-end. The information is stored on a PostgreSQL database (deployed on Supabase). I'm also create a Firebase storage to save the profile pictures. The backend is deployed on Render. 
Finally, I make the documentation with Swagger, which my frontend teammate can see all the routes, and the datatype of each param. 
## Tables

#### User

| Column | Type     | 
| :-------- | :------- | 
| `id` | `UUID string (PK)` | 
| `names` | `string` | 
| `last_name` | `string` | 
| `password` | `string` | 
| `email` | `string` | 
| `activation_token` | `string` | 
| `reset_password_token` | `string` | 
| `reset_token_expiration` | `date` | 
| `profileId` | `UUID string (FK Profile)` | 
| `has_profile` | `boolean` | 
| `created_at` | `date` | 
| `active` | `boolean` | 


#### Profile

| Column | Type     | 
| :-------- | :------- | 
| `id` | `UUID string (PK)` | 
| `knowledges` | `string array` | 
| `languages` | `string array` | 
| `location` | `JSON` | 
| `experience` | `array` | 
| `price` | `string` | 
| `education` | `string` | 
| `genre` | `string` | 
| `birthdate` | `date` | 
| `profile_picture` | `string` | 
| `description` | `string` | 
| `availability` | `JSON` |
| `social_network` | `JSON` | 
| `user_id` | `UUID string` |



## Tech Stack

**Server:** TypeScript, NestJs, TypeOrm, 

**Database:** PostgreSQL, Firebase, Supabase

## Author

Nicolas Fernandez
- https://github.com/NicoFerni
- https://www.linkedin.com/in/nicolasfernandev/

