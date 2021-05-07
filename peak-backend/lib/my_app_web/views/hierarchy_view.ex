defmodule MyAppWeb.HierarchyView do
  use MyAppWeb, :view
  alias MyAppWeb.HierarchyView

  def render("show.json", %{hierarchy: hierarchy}) do
    %{hierarchy: hierarchy}
  end
end
