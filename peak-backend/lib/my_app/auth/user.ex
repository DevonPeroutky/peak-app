defmodule MyApp.Auth.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, autogenerate: false}
  schema "users" do
    field :peak_user_id, :binary_id, default: Ecto.UUID.generate()
    field :access_token, :string
    field :one_time_code, :string
    field :email, :string
    field :family_name, :string
    field :given_name, :string
    field :image_url, :string
    field :hierarchy, {:array, :map}
    has_many :topics, MyApp.Domains.Topic

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :email, :image_url, :peak_user_id, :given_name, :one_time_code, :family_name, :access_token, :hierarchy])
    |> validate_required([:id, :email, :image_url, :peak_user_id, :given_name, :family_name, :access_token])
    |> unique_constraint(:email)
    |> unique_constraint(:id)
    |> unique_constraint(:access_token)
  end
end
