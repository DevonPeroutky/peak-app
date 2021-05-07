defmodule MyApp.LibraryTest do
  use MyApp.DataCase

  alias MyApp.Library

  describe "books" do
    alias MyApp.Library.Book

    @valid_attrs %{author: "some author", body: %{}, privacy_level: "some privacy_level", title: "some title"}
    @update_attrs %{author: "some updated author", body: %{}, privacy_level: "some updated privacy_level", title: "some updated title"}
    @invalid_attrs %{author: nil, body: nil, privacy_level: nil, title: nil}

    def book_fixture(attrs \\ %{}) do
      {:ok, book} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Library.create_book()

      book
    end

    test "list_books/0 returns all books" do
      book = book_fixture()
      assert Library.list_books() == [book]
    end

    test "get_book!/1 returns the book with given id" do
      book = book_fixture()
      assert Library.get_book!(book.id) == book
    end

    test "create_book/1 with valid data creates a book" do
      assert {:ok, %Book{} = book} = Library.create_book(@valid_attrs)
      assert book.author == "some author"
      assert book.body == %{}
      assert book.privacy_level == "some privacy_level"
      assert book.title == "some title"
    end

    test "create_book/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Library.create_book(@invalid_attrs)
    end

    test "update_book/2 with valid data updates the book" do
      book = book_fixture()
      assert {:ok, %Book{} = book} = Library.update_book(book, @update_attrs)
      assert book.author == "some updated author"
      assert book.body == %{}
      assert book.privacy_level == "some updated privacy_level"
      assert book.title == "some updated title"
    end

    test "update_book/2 with invalid data returns error changeset" do
      book = book_fixture()
      assert {:error, %Ecto.Changeset{}} = Library.update_book(book, @invalid_attrs)
      assert book == Library.get_book!(book.id)
    end

    test "delete_book/1 deletes the book" do
      book = book_fixture()
      assert {:ok, %Book{}} = Library.delete_book(book)
      assert_raise Ecto.NoResultsError, fn -> Library.get_book!(book.id) end
    end

    test "change_book/1 returns a book changeset" do
      book = book_fixture()
      assert %Ecto.Changeset{} = Library.change_book(book)
    end
  end
end
