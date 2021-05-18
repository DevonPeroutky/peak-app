# MyApp

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Gen
```
mix phx.gen.json Auth User users email:string:unique image_url:string google_id:string:unique given_name:string family_name:string access_token:string:unique, hierarchy:map
mix phx.gen.context Topic Topic topics name:string color:string privacy_level:string hierarchy:map user_id:references:users
mix phx.gen.json Domains Topic topics name:string color:string privacy_level:string hierarchy:map user_id:references:users
mix phx.gen.json Reading Future future_reads title:string url:string content_type:string topic_id:references:topics user_id:references:users date_added:utc_datetime date_read:utc_datetime
mix phx.gen.json Wiki Page pages topic_id:references:topics user_id:references:users body:map title:string privacy_level:string
mix phx.gen.json Organize Tag tags user_id:references:users title:string color:string
mix phx.gen.json Library Book books user_id:references:users title:string author:string body:map privacy_level:string
mix phx.gen.json Notes Scratchpad scratchpad user_id:references:users body:map
mix phx.gen.json WebpageMetadata LinkMetadata link_metadata user_id:references:users url:string title:string url description:string cover_image_url:string fav_icon_url:string --no-context --no-schema
mix phx.gen.json Blog Subdomains subdomains user_id:references:users title:string subdomain:string 
mix phx.gen.json Blog Posts subdomain:references:subdomains title:string subtitle:text cover_image:string logo:string snippet:text user_id:references:users body:map tag_ids:array visibility:string post_type:string
```

### Seeds
```
MyApp.Domains.create_topic(%{color: "green", name: "swag", privacy_level: "private", hierarchy: %{}, user_id: "ff416836-ea90-4fd2-83a4-6fe161dc9559"})
``` 

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix