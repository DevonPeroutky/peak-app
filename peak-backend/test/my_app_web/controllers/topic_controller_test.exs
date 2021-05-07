defmodule MyAppWeb.TopicControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Domains
  alias MyApp.Domains.Topic

  @create_attrs %{
    color: "some color",
    hierarchy: %{},
    name: "some name",
    privacy_level: "some privacy_level"
  }
  @update_attrs %{
    color: "some updated color",
    hierarchy: %{},
    name: "some updated name",
    privacy_level: "some updated privacy_level"
  }
  @invalid_attrs %{color: nil, hierarchy: nil, name: nil, privacy_level: nil}

  def fixture(:topic) do
    {:ok, topic} = Domains.create_topic(@create_attrs)
    topic
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all topics", %{conn: conn} do
      conn = get(conn, Routes.topic_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create topic" do
    test "renders topic when data is valid", %{conn: conn} do
      conn = post(conn, Routes.topic_path(conn, :create), topic: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.topic_path(conn, :show, id))

      assert %{
               "id" => id,
               "color" => "some color",
               "hierarchy" => %{},
               "name" => "some name",
               "privacy_level" => "some privacy_level"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.topic_path(conn, :create), topic: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update topic" do
    setup [:create_topic]

    test "renders topic when data is valid", %{conn: conn, topic: %Topic{id: id} = topic} do
      conn = put(conn, Routes.topic_path(conn, :update, topic), topic: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.topic_path(conn, :show, id))

      assert %{
               "id" => id,
               "color" => "some updated color",
               "hierarchy" => %{},
               "name" => "some updated name",
               "privacy_level" => "some updated privacy_level"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, topic: topic} do
      conn = put(conn, Routes.topic_path(conn, :update, topic), topic: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete topic" do
    setup [:create_topic]

    test "deletes chosen topic", %{conn: conn, topic: topic} do
      conn = delete(conn, Routes.topic_path(conn, :delete, topic))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.topic_path(conn, :show, topic))
      end
    end
  end

  defp create_topic(_) do
    topic = fixture(:topic)
    {:ok, topic: topic}
  end
end
