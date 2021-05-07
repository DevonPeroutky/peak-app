defmodule MyApp.Repo.Migrations.CreateBooks do
  use Ecto.Migration

  def change do
    create table(:books, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :note_type, :string, null: false
      add :url, :text
      add :icon_url, :text
      add :author, :string
      add :body, {:array, :map}, null: false
      add :privacy_level, :string
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false
      add :tag_ids, {:array, :string}

      timestamps()
    end

    create index(:books, [:user_id])
  end
end
