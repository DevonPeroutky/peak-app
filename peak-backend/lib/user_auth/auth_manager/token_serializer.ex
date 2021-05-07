defmodule MyAppWeb.GuardianSerializer do
  @behaviour Guardian.Serializer

  alias MyAppName.Repo
  alias MyAppName.User
  alias MyApp.Auth
  alias MyApp.Auth.User


  def for_token(user = %User{}), do: { :ok, "User:#{user.id}" }
  def for_token(_), do: { :error, "Unknown resource type" }

  def from_token("User:" <> id), do: { :ok, Auth.get_user!(id) }
  def from_token(_), do: { :error, "Unknown resource type" }
end