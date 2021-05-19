defmodule MyApp.Blog.Subdomain do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "subdomains" do
    field :subdomain, :string
    field :title, :string
    field :user_id, :binary_id

    timestamps()
  end

  @doc false
  def changeset(subdomain, attrs) do
    subdomain
    |> cast(attrs, [:title, :subdomain])
    |> validate_required([:title, :subdomain])
  end
end
