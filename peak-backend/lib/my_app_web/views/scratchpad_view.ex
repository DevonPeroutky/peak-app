defmodule MyAppWeb.ScratchpadView do
  use MyAppWeb, :view
  alias MyAppWeb.ScratchpadView

  def render("index.json", %{scratchpad: scratchpad}) do
    %{data: render_many(scratchpad, ScratchpadView, "scratchpad.json")}
  end

  def render("show.json", %{scratchpad: scratchpad}) do
    %{data: render_one(scratchpad, ScratchpadView, "scratchpad.json")}
  end

  def render("scratchpad.json", %{scratchpad: scratchpad}) do
    %{id: scratchpad.id,
      title: "scratchpad",
      body: scratchpad.body}
  end
end
