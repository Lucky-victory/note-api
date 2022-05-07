# note-api

Note API built with NodeJS, Express and HarperDB.

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

- `DB_HOST`: your HarperDB instance URL, e.g https://xxxxxxxxx.harperdbcloud.com
- `DB_USER`: your HarperDB instance username.
- `DB_PASS`: your HarperDB instance password.

Now, Run the following command.

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
