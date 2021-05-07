defmodule MyApp.Repo.Migrations.AddCoverImageToBooks do
  use Ecto.Migration

  def change do
    alter table(:books) do
      add :cover_image_url, :string, null: true, size: 2025
      add :description, :string, null: true, size: 560
    end
  end
end
