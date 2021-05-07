defmodule MyApp.Repo.Migrations.CreatePages do
  use Ecto.Migration

  def change do
    create table(:pages, primary_key: false) do
      add :id, :binary_id, primary_key: true, null: false
      add :body, {:array, :map}, null: false
      add :title, :string
      add :privacy_level, :string, null: false
      add :topic_id, references(:topics, on_delete: :nothing, type: :binary_id)
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false

      timestamps()
    end

    create index(:pages, [:topic_id])
    create index(:pages, [:user_id])
  end
end
