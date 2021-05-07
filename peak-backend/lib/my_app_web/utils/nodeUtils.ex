defmodule MyAppWeb.Utils.NodeUtils do
  require Logger

  # Empty body
  # [%{children: [%{"text" => ""}], id: 1609745541701, type: "p"}]
  def is_node_empty(node) do
    if is_list(node) && length(node) == 1 && List.first(node)["children"] && List.first(node)["children"] && List.first(List.first(node)["children"])["text"] == "" do
      true
    else
      false
    end
  end

  def paragraph_buffer_node() do
    %{"children" => [%{"text" => ""}], "type" => "p", "id" => System.os_time(:millisecond)}
  end
end
