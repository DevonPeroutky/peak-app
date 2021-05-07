defmodule MyApp.DomainsTest do
  use MyApp.DataCase

  alias MyApp.Domains

  describe "topics" do
    alias MyApp.Domains.Topic

    @valid_attrs %{color: "some color", hierarchy: %{}, name: "some name", privacy_level: "some privacy_level"}
    @update_attrs %{color: "some updated color", hierarchy: %{}, name: "some updated name", privacy_level: "some updated privacy_level"}
    @invalid_attrs %{color: nil, hierarchy: nil, name: nil, privacy_level: nil}

    def topic_fixture(attrs \\ %{}) do
      {:ok, topic} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Domains.create_topic()

      topic
    end

    test "list_topics/0 returns all topics" do
      topic = topic_fixture()
      assert Domains.list_topics() == [topic]
    end

    test "get_topic!/1 returns the topic with given id" do
      topic = topic_fixture()
      assert Domains.get_topic!(topic.id) == topic
    end

    test "create_topic/1 with valid data creates a topic" do
      assert {:ok, %Topic{} = topic} = Domains.create_topic(@valid_attrs)
      assert topic.color == "some color"
      assert topic.hierarchy == %{}
      assert topic.name == "some name"
      assert topic.privacy_level == "some privacy_level"
    end

    test "create_topic/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Domains.create_topic(@invalid_attrs)
    end

    test "update_topic/2 with valid data updates the topic" do
      topic = topic_fixture()
      assert {:ok, %Topic{} = topic} = Domains.update_topic(topic, @update_attrs)
      assert topic.color == "some updated color"
      assert topic.hierarchy == %{}
      assert topic.name == "some updated name"
      assert topic.privacy_level == "some updated privacy_level"
    end

    test "update_topic/2 with invalid data returns error changeset" do
      topic = topic_fixture()
      assert {:error, %Ecto.Changeset{}} = Domains.update_topic(topic, @invalid_attrs)
      assert topic == Domains.get_topic!(topic.id)
    end

    test "delete_topic/1 deletes the topic" do
      topic = topic_fixture()
      assert {:ok, %Topic{}} = Domains.delete_topic(topic)
      assert_raise Ecto.NoResultsError, fn -> Domains.get_topic!(topic.id) end
    end

    test "change_topic/1 returns a topic changeset" do
      topic = topic_fixture()
      assert %Ecto.Changeset{} = Domains.change_topic(topic)
    end
  end
end
