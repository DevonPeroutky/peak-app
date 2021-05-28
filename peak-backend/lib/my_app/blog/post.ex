defmodule MyApp.Blog.Post do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: false}
  @foreign_key_type :binary_id
  schema "posts" do
    field :body, {:array, :map}
    field :cover_image, :string
    field :post_type, :string
    field :snippet, :string
    field :subtitle, :string
    field :tag_ids, {:array, :binary_id}
    field :title, :string
    field :visibility, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]
    belongs_to :subdomain, MyApp.Blog.Subdomain, [foreign_key: :subdomain_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(post, attrs) do
    attrs |> IO.inspect
    post
    |> cast(attrs, [:id, :title, :subtitle, :cover_image, :snippet, :body, :tag_ids, :visibility, :post_type, :user_id, :subdomain_id])
    |> validate_required([:title, :body, :tag_ids, :visibility, :post_type, :user_id, :subdomain_id])
  end
end
