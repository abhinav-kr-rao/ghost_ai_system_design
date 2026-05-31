On statring the app, authenticated user is redirected to /editor, which is fine.
But an unauthenticated user is redirected an URL that is not localhost:3000/sign-in, instead it is a clerk url (like accounts.dev/...)

The unauthenticated user should be redirected to /sign-in.

Also the ui of /sign-in page is not as it should be,
keep it in dark mode (use the specified colour pallete everywhere)

The left half should have logo and text about company, the right half should only have the clerk form.
On small screens, only the clerk form should be visible.

