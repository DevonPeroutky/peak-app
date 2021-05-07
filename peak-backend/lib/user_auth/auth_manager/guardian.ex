defmodule UserAuth.AuthManager.Guardian do
  use Guardian, otp_app: :my_app

  alias MyApp.Auth

  # Encode a User into a Token
  def subject_for_token(user, _claims) do
    sub = to_string(user["id"])
    {:ok, sub}
  end

  # "Rehydrate" the Users from the claims
  def resource_from_claims(%{"sub" => user_id}) do
    ## Ideally we Fetch the users only when refreshing
    user = Auth.get_user!(user_id)
    {:ok, user}
  rescue
    Ecto.NoResultsError -> {:error, :resource_not_found}
  end

  def generate_socket_access_token(%{id: user_id}) do
    encode_and_sign(%{"id" => user_id})
  end

  def decode_and_verify_jwt_access_token(token) do
    case decode_and_verify(token) do
      {:ok, claims} ->
        user_id = claims["sub"]
        Auth.get_user(user_id)
      {:error, _reason} ->
        :error
    end
  end
end
