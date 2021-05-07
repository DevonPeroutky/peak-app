defmodule MyApp.Repo.Migrations.CreateScratchpad do
  use Ecto.Migration

  def change do
    create table(:scratchpad, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :body, :map
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false

      timestamps()
    end

    create index(:scratchpad, [:user_id])
  end
end
