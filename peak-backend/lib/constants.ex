defmodule Constants do
  defmacro const(const_name, const_value) do
    quote do
      def unquote(const_name)(), do: unquote(const_value)
    end
  end
end

defmodule MyApp.Constant do
  import Constants

  const :web_note, "peak_web_note"
end

