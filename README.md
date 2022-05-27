# note-api

Note API built with NodeJS, Express and HarperDB.

You can find the article for this API [here](https://viblog.hashnode.dev/build-a-note-keeping-api-with-nodejs-express-and-harperdb).
## How to use.

Clone the repo

```
git clone https://github.com/Lucky-victory/note-api
```

Move into the directory

```
cd note-api
```

Copy the `.env.example` file to the `.env` file

```
cp .env.example .env
```

Fill out the following placeholders with correct details.
> if you don't have a HarperDB account, you can [sign up](https://harperdb.io?utm_source=luckyvictory) for a free account.
- `DB_HOST`: your HarperDB instance URL, e.g https://xxxxxxxxx.harperdbcloud.com
- `DB_USER`: your HarperDB instance username.
- `DB_PASS`: your HarperDB instance password.

Now, Run the following commands.

```
 npm install
 npm run db:init
 npm run start
```

## Routes for the API

> except for the **account** route, every other route requires an apikey to be passed as a query parameter.

- **/account**
  - `/sign-up [method=post]`: to register a new user.
  - `/sign-in [method=post]` : to log in a user.
- **/notes**`[method=get]`: fetch a user's notes.
  - `/new [method=post]`: add a new note.
  - `/edit/:id [method=put]`: edit a note by its ID.
  - `/to-trash:id [method=put]`: move a note to trash.
  - `/out-of-trash:id [method=put]`: remove a note from the trash.
- **/tokens**
  - `/new [method=post]`: generate a new apikey.
  - `/revoke/:apikeyToRevoke [method=put]`: revoke an apikey.
  - `/drop/:apikeyToDrop [method=delete]`: discard an apikey.
- **/trash** `[method=get]`: fetch notes in trash.
  - `/trash/:noteID [method=delete]`: permanently discard a note.
  
 ## Example screenshots:
  
  ### acount route
 ![Screenshot 2022-05-06 190623.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651914198853/s-_RdqUMz.png)
 
![Screenshot 2022-05-06 190814.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651914208965/Zn3Oj8Su7.png)
### tokens route
![Screenshot 2022-05-07 090212.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651914105409/AHhcSmEYX.png)

![Screenshot 2022-05-07 090406.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651914138626/XHODI7RJH.png)

![Screenshot 2022-05-07 090832.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651914156762/Uq6iYXnI7.png)
### notes route
![Screenshot 2022-05-06 191149.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651913711402/pkaHPluAl.png)
![Screenshot 2022-05-06 191408.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651913728989/DdZNnApdY.png)
![Screenshot 2022-05-06 235000.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651913798388/Wq62qA-no.png)
![Screenshot 2022-05-07 085836.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651913827851/sBuLRYyhq.png)
![Screenshot 2022-05-07 085952.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651913839236/B9ZNWnMPp.png)
