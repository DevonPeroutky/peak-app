defmodule MyAppWeb.PostsControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Blog
  alias MyApp.Blog.Posts

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

  def fixture(:posts) do
    {:ok, posts} = Blog.create_posts(@create_attrs)
    posts
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all blog_posts", %{conn: conn} do
      conn = get(conn, Routes.posts_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create posts" do
    test "renders posts when data is valid", %{conn: conn} do
      conn = post(conn, Routes.posts_path(conn, :create), posts: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.posts_path(conn, :show, id))

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
      conn = post(conn, Routes.posts_path(conn, :create), posts: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update posts" do
    setup [:create_posts]

    test "renders posts when data is valid", %{conn: conn, posts: %Posts{id: id} = posts} do
      conn = put(conn, Routes.posts_path(conn, :update, posts), posts: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.posts_path(conn, :show, id))

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

    test "renders errors when data is invalid", %{conn: conn, posts: posts} do
      conn = put(conn, Routes.posts_path(conn, :update, posts), posts: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete posts" do
    setup [:create_posts]

    test "deletes chosen posts", %{conn: conn, posts: posts} do
      conn = delete(conn, Routes.posts_path(conn, :delete, posts))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.posts_path(conn, :show, posts))
      end
    end
  end

  defp create_posts(_) do
    posts = fixture(:posts)
    %{posts: posts}
  end
end
