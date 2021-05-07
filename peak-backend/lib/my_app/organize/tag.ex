defmodule MyApp.Organize.Tag do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Jason.Encoder, only: [:id, :color, :title, :inserted_at]}
  schema "tags" do
    field :color, :string
    field :title, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(tag, attrs) do
    tag
    |> cast(attrs, [:title, :color, :user_id])
    |> update_change(:title, &String.downcase/1)
    |> validate_required([:title, :color, :user_id])
    |> unique_constraint(:unique_tag_names, name: :unique_tag_per_user)
  end
end
