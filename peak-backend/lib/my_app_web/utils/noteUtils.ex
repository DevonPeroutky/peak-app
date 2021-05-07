defmodule MyAppWeb.Utils.NoteUtils do
  require Logger

  # Empty body
  # [%{children: [%{"text" => ""}], id: 1609745541701, type: "p"}]
  def is_note_empty(node) do
    if is_list(node) && length(node) == 1 && node[0]["children"] && node[0]["children"] && node[0]["children"][0]["text"] == "" do
      true
    else
      false
    end
  end
end
