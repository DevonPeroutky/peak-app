defmodule MyApp.Notes.Scratchpad do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Jason.Encoder, only: [:id, :body, :user_id]}
  schema "scratchpad" do
    field :body, {:array, :map}, default: [%{"children": [%{"text" => ""}], "type": "p", "id": System.os_time(:millisecond)}]
    field :user_id, :string

    timestamps()
  end

  @doc false
  def changeset(scratchpad, attrs) do
    scratchpad
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
  end
end
