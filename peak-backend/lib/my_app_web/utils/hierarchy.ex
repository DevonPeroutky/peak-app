defmodule TopicNode do
  @derive Jason.Encoder
  defstruct title: nil, children: [], disabled: true, topic_id: nil
end

defmodule StructureNode do
  defstruct title: nil, children: [], topic_id: nil, page_id: nil, header_type: nil, header_id: nil, updated_at: nil
end

defmodule MyAppWeb.Utils.Hierarchy do
  require Logger
  alias MyApp.Domains.Topic

  def add_topic_to_hierarchy(%Topic{} = topic, hierarchy) do
    new_topic_node = %TopicNode{title: topic.name, topic_id: topic.id}
    [new_topic_node | hierarchy]
  end

  def update_topic_name_in_hierarchy(%Topic{} = topic, hierarchy) do
    new_topic_node = %TopicNode{title: topic.name, topic_id: topic.id}
    [new_topic_node | Enum.filter(hierarchy, fn x -> x["topic_id"] != topic.id end)]
  end

  def remove_topic_from_hierarchy(topic_id, hierarchy) do
    Enum.filter(hierarchy, fn x -> x["topic_id"] != topic_id end)
  end

  def remove_page_from_hierarchy(topic_id, page_id, hierarchy) do
    topic_node = Enum.find(hierarchy, fn tNode -> tNode["topic_id"] == topic_id end)
    new_children = Enum.filter(topic_node["children"], fn pNode -> pNode["page_id"] != page_id end)
    new_topic_node = Map.put(topic_node, "children", new_children)
    [new_topic_node | Enum.filter(hierarchy, fn x -> x["topic_id"] != topic_id end) ]
  end
end
