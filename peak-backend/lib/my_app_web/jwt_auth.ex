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
end
