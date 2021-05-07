defmodule MyApp.ReadingTest do
  use MyApp.DataCase

  alias MyApp.Reading

  describe "future_reads" do
    alias MyApp.Reading.Future

    @valid_attrs %{content_type: "some content_type", date_added: "2010-04-17T14:00:00Z", date_read: "2010-04-17T14:00:00Z", title: "some title", url: "some url"}
    @update_attrs %{content_type: "some updated content_type", date_added: "2011-05-18T15:01:01Z", date_read: "2011-05-18T15:01:01Z", title: "some updated title", url: "some updated url"}
    @invalid_attrs %{content_type: nil, date_added: nil, date_read: nil, title: nil, url: nil}

    def future_fixture(attrs \\ %{}) do
      {:ok, future} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Reading.create_future()

      future
    end

    test "list_future_reads/0 returns all future_reads" do
      future = future_fixture()
      assert Reading.list_future_reads() == [future]
    end

    test "get_future!/1 returns the future with given id" do
      future = future_fixture()
      assert Reading.get_future!(future.id) == future
    end

    test "create_future/1 with valid data creates a future" do
      assert {:ok, %Future{} = future} = Reading.create_future(@valid_attrs)
      assert future.content_type == "some content_type"
      assert future.date_added == DateTime.from_naive!(~N[2010-04-17T14:00:00Z], "Etc/UTC")
      assert future.date_read == DateTime.from_naive!(~N[2010-04-17T14:00:00Z], "Etc/UTC")
      assert future.title == "some title"
      assert future.url == "some url"
    end

    test "create_future/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Reading.create_future(@invalid_attrs)
    end

    test "update_future/2 with valid data updates the future" do
      future = future_fixture()
      assert {:ok, %Future{} = future} = Reading.update_future(future, @update_attrs)
      assert future.content_type == "some updated content_type"
      assert future.date_added == DateTime.from_naive!(~N[2011-05-18T15:01:01Z], "Etc/UTC")
      assert future.date_read == DateTime.from_naive!(~N[2011-05-18T15:01:01Z], "Etc/UTC")
      assert future.title == "some updated title"
      assert future.url == "some updated url"
    end

    test "update_future/2 with invalid data returns error changeset" do
      future = future_fixture()
      assert {:error, %Ecto.Changeset{}} = Reading.update_future(future, @invalid_attrs)
      assert future == Reading.get_future!(future.id)
    end

    test "delete_future/1 deletes the future" do
      future = future_fixture()
      assert {:ok, %Future{}} = Reading.delete_future(future)
      assert_raise Ecto.NoResultsError, fn -> Reading.get_future!(future.id) end
    end

    test "change_future/1 returns a future changeset" do
      future = future_fixture()
      assert %Ecto.Changeset{} = Reading.change_future(future)
    end
  end
end
