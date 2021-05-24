defmodule MyApp.Blog.Subdomain do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "subdomains" do
    field :subdomain, :string
    field :title, :string
    field :description, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(subdomain, attrs) do
    subdomain
    |> cast(attrs, [:title, :subdomain, :description, :user_id])
    |> validate_required([:title, :subdomain, :description, :user_id])
    |> update_change(:subdomain, &String.downcase/1)
    |> unique_constraint(:subdomain_unique_constraint, name: :unique_subdomain)
  end
end
