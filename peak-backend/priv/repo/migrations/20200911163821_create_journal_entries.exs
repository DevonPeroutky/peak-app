defmodule MyApp.Repo.Migrations.CreateJournalEntries do
  use Ecto.Migration

  def change do
    create table(:journal_entries, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :body, {:array, :map}, null: false
      add :entry_date, :date
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false

      timestamps()
    end

    create index(:journal_entries, [:user_id])
    create unique_index(:journal_entries, [:user_id, :entry_date], name: :unique_user_entry)
  end
end
