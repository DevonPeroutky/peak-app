defmodule MyApp.Repo.Migrations.ChangeMaxLengthOfTitle do
  use Ecto.Migration

  def change do
    alter table(:books) do
      modify :title, :string, null: false, size: 510
    end

    alter table(:pages) do
      modify :title, :string, size: 510
    end

    alter table(:future_reads) do
      modify :title, :string, null: false, size: 510
    end
  end
end
