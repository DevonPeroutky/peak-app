# Pulled from https://elixirforum.com/t/trying-to-verify-google-idtoken-using-joken-jokenjwks/28420
# Does not work

defmodule MyApp.MyJWKSStrategy do
  use JokenJwks.DefaultStrategyTemplate

  def init_opts(opts) do
    url = "https://www.googleapis.com/oauth2/v3/certs"
    Keyword.merge(opts, jwks_url: url)
  end
end

defmodule MyApp.GoogleToken do
  use Joken.Config

  add_hook(JokenJwks, strategy: MyApp.MyJWKSStrategy)

  @iss1 "https://accounts.google.com"
  @iss2 "accounts.google.com"
  @google_client_id "261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"


  #@impl true
  def token_config do

    # validate from the token
    default_claims(skip: [:aud, :iss])
    |> add_claim("iss", nil, &(&1 == @iss1 || &1 == @iss2))
    |> add_claim("aud", nil, &(&1 == @google_client_id))
  end

  def test do
    jwt_id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ0Y2JhMjVlNTYzNjYwYTkwMDlkODIwYTFjMDIwMjIwNzA1NzRlODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxOTE0MTc3NjQxLTBndTVqYW02YXJ2NW02bjk1dmRqbWZ1OGhwYTFrdW5qLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxOTE0MTc3NjQxLTBndTVqYW02YXJ2NW02bjk1dmRqbWZ1OGhwYTFrdW5qLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA4NzAzMTc0NjY5MjMyNDIxNDIxIiwiZW1haWwiOiJkZXZvbnBlcm91dGt5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiV24tcENqTmJDUlBqNXg5QzRMUTZjQSIsIm5hbWUiOiJEZXZvbiBQZXJvdXRreSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVQ2eXJOb3VWalp3L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y25hSUNTWXREQU9hS0ZadnB5bnd2cHlMQXA2NHcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkRldm9uIiwiZmFtaWx5X25hbWUiOiJQZXJvdXRreSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjA3ODIzMTQ4LCJleHAiOjE2MDc4MjY3NDgsImp0aSI6IjdlOTk5ZTlkNzY2OWRmNmIwNjM3YWQ0Mzc4MDdmNDcwMGY1M2VmOWEifQ.rohfCk53ptymaTIl6TiDFTryRB3IIk5an4x9fIUeQU2FidFFlQYnzWD9mWjKpUnLeSbnjylhjvPG3HEiFpCg738dU_4RzqrQiihJfIEdPTrYMfngYgZQGdSQOt_4Wd8BpOV4BYygC9Mup8vvjZXClJ6SojYG0JmRG6w-ICiyn9qad_dvLa0ygkG-VQBe1MXLzyufP--1u-9Pi8iX75X2dgTm1f-b7mXAqM4hGBcy_pBinQxxpll-zb03dOJeVPyBG1aUCabgGAEJURt04KBuY4zXSiGBxA6ESWHlotq0M-_PvIE-G1ASJg2pmSlf60g2Hz0IrcryFjYI9VIoJKDqNw"
    jwt_access_token = "ya29.a0AfH6SMBAPX2NhKcXLLM1nwe8D34RVkPUI75kW7_s7xrvWumxzvwj4fNQGuVVFi152cLwohuaoOWJZI8kyLFK4sTRMfyYiG8300aWrPqfQ3kP_F-orMwpWdYGe40KOXmg-ntaz8saA_Y-HZLD9UkvioQ_mCSCKBS0ffCAFGBgsWk"

    IO.puts "Verify Id token:"
    verify_and_validate(jwt_id_token)
  end
end

defmodule MyApp.JWKSApplication do
  @moduledoc false

  def start() do
    # List all child processes to be supervised
    children = [
      # other code,,,,
      {MyApp.MyJWKSStrategy, time_interval: 60_000},
    ]
    # other code..
    Supervisor.start_link(children, [strategy: :one_for_one, name: MyApp.JWKSSupervisor])

  end

end

# c("scripts/never_used_jokenjwks.ex")