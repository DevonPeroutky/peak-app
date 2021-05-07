defmodule MyAppWeb.LinkMetadataControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.WebpageMetadata
  alias MyApp.WebpageMetadata.LinkMetadata

  @create_attrs %{
    cover_image_url: "some cover_image_url",
    description: "some description",
    fav_icon_url: "some fav_icon_url",
    title: "some title",
    url: "some url"
  }
  @update_attrs %{
    cover_image_url: "some updated cover_image_url",
    description: "some updated description",
    fav_icon_url: "some updated fav_icon_url",
    title: "some updated title",
    url: "some updated url"
  }
  @invalid_attrs %{cover_image_url: nil, description: nil, fav_icon_url: nil, title: nil, url: nil}

  def fixture(:link_metadata) do
    {:ok, link_metadata} = WebpageMetadata.create_link_metadata(@create_attrs)
    link_metadata
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all link_metadata", %{conn: conn} do
      conn = get(conn, Routes.link_metadata_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create link_metadata" do
    test "renders link_metadata when data is valid", %{conn: conn} do
      conn = post(conn, Routes.link_metadata_path(conn, :create), link_metadata: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.link_metadata_path(conn, :show, id))

      assert %{
               "id" => id,
               "cover_image_url" => "some cover_image_url",
               "description" => "some description",
               "fav_icon_url" => "some fav_icon_url",
               "title" => "some title",
               "url" => "some url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.link_metadata_path(conn, :create), link_metadata: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update link_metadata" do
    setup [:create_link_metadata]

    test "renders link_metadata when data is valid", %{conn: conn, link_metadata: %LinkMetadata{id: id} = link_metadata} do
      conn = put(conn, Routes.link_metadata_path(conn, :update, link_metadata), link_metadata: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.link_metadata_path(conn, :show, id))

      assert %{
               "id" => id,
               "cover_image_url" => "some updated cover_image_url",
               "description" => "some updated description",
               "fav_icon_url" => "some updated fav_icon_url",
               "title" => "some updated title",
               "url" => "some updated url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, link_metadata: link_metadata} do
      conn = put(conn, Routes.link_metadata_path(conn, :update, link_metadata), link_metadata: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete link_metadata" do
    setup [:create_link_metadata]

    test "deletes chosen link_metadata", %{conn: conn, link_metadata: link_metadata} do
      conn = delete(conn, Routes.link_metadata_path(conn, :delete, link_metadata))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.link_metadata_path(conn, :show, link_metadata))
      end
    end
  end

  defp create_link_metadata(_) do
    link_metadata = fixture(:link_metadata)
    %{link_metadata: link_metadata}
  end
end
