defmodule MyApp.Domains.Topic do
  use Ecto.Schema
  import Ecto.Changeset
  require Logger

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "topics" do
    field :color, :string
    field :hierarchy, {:array, :map}
    field :name, :string
    field :privacy_level, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(topic, attrs) do
    topic
    |> cast(attrs, [:name, :color, :privacy_level, :hierarchy, :user_id])
    |> update_change(:name, &String.downcase/1)
    |> validate_required([:name, :color, :privacy_level, :user_id])
    |> unique_constraint(:user_topic_unique_constraint, name: :unique_user_topic)
  end
end
