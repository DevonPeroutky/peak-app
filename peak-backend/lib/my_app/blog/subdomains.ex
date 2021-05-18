defmodule MyApp.Blog.Subdomains do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "subdomains" do
    field :subdomain, :string
    field :title, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]
    belongs_to :peak_user, MyApp.Auth.User, [foreign_key: :peak_user_id, type: :binary_id]

    timestamps()
  end

  @doc false
  def changeset(subdomains, attrs) do
    subdomains
    |> cast(attrs, [:title, :subdomain])
    |> validate_required([:title, :subdomain])
  end
end
