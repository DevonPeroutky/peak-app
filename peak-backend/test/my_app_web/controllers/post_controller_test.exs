defmodule MyAppWeb.PostControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Blog
  alias MyApp.Blog.Post

  @create_attrs %{
    body: %{},
    cover_image: "some cover_image",
    logo: "some logo",
    post_type: "some post_type",
    snippet: "some snippet",
    subtitle: "some subtitle",
    tag_ids: [],
    title: "some title",
    visibility: "some visibility"
  }
  @update_attrs %{
    body: %{},
    cover_image: "some updated cover_image",
    logo: "some updated logo",
    post_type: "some updated post_type",
    snippet: "some updated snippet",
    subtitle: "some updated subtitle",
    tag_ids: [],
    title: "some updated title",
    visibility: "some updated visibility"
  }
  @invalid_attrs %{body: nil, cover_image: nil, logo: nil, post_type: nil, snippet: nil, subtitle: nil, tag_ids: nil, title: nil, visibility: nil}

  def fixture(:post) do
    {:ok, post} = Blog.create_post(@create_attrs)
    post
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all posts", %{conn: conn} do
      conn = get(conn, Routes.post_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create post" do
    test "renders post when data is valid", %{conn: conn} do
      conn = post(conn, Routes.post_path(conn, :create), post: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.post_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{},
               "cover_image" => "some cover_image",
               "logo" => "some logo",
               "post_type" => "some post_type",
               "snippet" => "some snippet",
               "subtitle" => "some subtitle",
               "tag_ids" => [],
               "title" => "some title",
               "visibility" => "some visibility"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.post_path(conn, :create), post: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update post" do
    setup [:create_post]

    test "renders post when data is valid", %{conn: conn, post: %Post{id: id} = post} do
      conn = put(conn, Routes.post_path(conn, :update, post), post: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.post_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{},
               "cover_image" => "some updated cover_image",
               "logo" => "some updated logo",
               "post_type" => "some updated post_type",
               "snippet" => "some updated snippet",
               "subtitle" => "some updated subtitle",
               "tag_ids" => [],
               "title" => "some updated title",
               "visibility" => "some updated visibility"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, post: post} do
      conn = put(conn, Routes.post_path(conn, :update, post), post: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete post" do
    setup [:create_post]

    test "deletes chosen post", %{conn: conn, post: post} do
      conn = delete(conn, Routes.post_path(conn, :delete, post))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.post_path(conn, :show, post))
      end
    end
  end

  defp create_post(_) do
    post = fixture(:post)
    %{post: post}
  end
end
