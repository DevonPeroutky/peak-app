echo "Running the migrations..."
_build/prod/rel/my_app/bin/my_app eval "MyApp.Release.migrate"
echo "Finished!"

_build/prod/rel/my_app/bin/my_app start