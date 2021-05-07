# Pulled from https://elixirforum.com/t/using-joken-to-validate-google-jwts/19728/15
# c("scripts/debug_google_certs.ex")

defmodule MyApp.GoogleCertApplication do
  @moduledoc false

  use Application
  alias GoogleCerts.CertificateCache

  def start() do
    children = [
      CertificateCache
    ]

    {:ok, pid} = Supervisor.start_link(children, [strategy: :one_for_one, name: MyGoogleCertApp.Supervisor])
  end
end

defmodule MyApp.Crypto.VerifyHook do
  @moduledoc false

  use Joken.Hooks

  @impl true
  def before_verify(_options, {jwt, %Joken.Signer{} = _signer}) do
    with {:ok, %{"kid" => kid}} <- Joken.peek_header(jwt),
         {:ok, algorithm, key} <- GoogleCerts.fetch(kid) do
      {:cont, {jwt, Joken.Signer.create(algorithm, key)}}
    else
      error -> {:halt, {:error, :no_signer}}
    end
  end
end

defmodule MyApp.Crypto.JWTManager do
  @moduledoc false

  use Joken.Config, default_signer: nil

  # Instructions are here: https://developers.google.com/identity/sign-in/web/backend-auth
  @iss1 "https://accounts.google.com"
  @iss2 "accounts.google.com"
  @google_client_id "261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"

  # reference your custom verify hook here
  add_hook(MyApp.Crypto.VerifyHook)

  @impl Joken.Config
  def token_config do
    default_claims(skip: [:aud, :iss])
    |> add_claim("aud", nil, &(&1 == @google_client_id))
    |> add_claim("iss", nil, &(&1 == @iss1 || &1 == @iss2))
  end

  def test do
    jwt_id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ0Y2JhMjVlNTYzNjYwYTkwMDlkODIwYTFjMDIwMjIwNzA1NzRlODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxOTE0MTc3NjQxLTBndTVqYW02YXJ2NW02bjk1dmRqbWZ1OGhwYTFrdW5qLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxOTE0MTc3NjQxLTBndTVqYW02YXJ2NW02bjk1dmRqbWZ1OGhwYTFrdW5qLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA4NzAzMTc0NjY5MjMyNDIxNDIxIiwiZW1haWwiOiJkZXZvbnBlcm91dGt5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiSUt4QllvWUdvV2pONGhKdXNCdmpkdyIsIm5hbWUiOiJEZXZvbiBQZXJvdXRreSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVQ2eXJOb3VWalp3L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y25hSUNTWXREQU9hS0ZadnB5bnd2cHlMQXA2NHcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkRldm9uIiwiZmFtaWx5X25hbWUiOiJQZXJvdXRreSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjA3ODI4NzE5LCJleHAiOjE2MDc4MzIzMTksImp0aSI6IjAwM2YzOTk2ZDM3ZDNlNjQ3MmIyOWNkOTA1ZTAyNjc4Nzc4OGQzNTMifQ.G-RDOpvXI9uj4sVX-FrarskNhrs46-aflpinhKUNFa88UB-LF0RhDHdWoawr0h8pqklg7beuRc_rGlhCKXwWJ5_Q95jMHI7El3Cb-zVo5zpC2UVWpFKwQceraxglc_ezjjEe051AFUPWFExStu-AdPGQHXkGjvLCWiqbMsx7m8dczHtM31Z4p01RaoRVyVToi5yeJCpZmD8J6HEgB9vp7ACL89MxRf90bTiMeVIgNJzRA9v91kIA28HaM0qxyz-LS-1ICA7AiZI-6lVkm-mdSLuYZ_o121yJ6_vK4_LxK5aGErxFVwFZ0hPtH_peV3WDpVSzFCY23djoOjoLry-W0g"
    jwt_access_token = "ya29.a0AfH6SMBAPX2NhKcXLLM1nwe8D34RVkPUI75kW7_s7xrvWumxzvwj4fNQGuVVFi152cLwohuaoOWJZI8kyLFK4sTRMfyYiG8300aWrPqfQ3kP_F-orMwpWdYGe40KOXmg-ntaz8saA_Y-HZLD9UkvioQ_mCSCKBS0ffCAFGBgsWk"
    google_client_id="261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"

    IO.puts "Verify Access token:"
    hey = verify_and_validate(jwt_access_token)
    IO.inspect hey

    IO.puts "Verify Id token:"
    verify_and_validate(jwt_id_token)
  end
end
