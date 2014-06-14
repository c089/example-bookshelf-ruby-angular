An example of a simple bookshelf application using Angular.js and the ruby
Sinatra library, communicating over a RESTful API and persisting data in
ElasticSearch.

To install dependencies:
`cd frontend && npm install && cd ../server && bundle install && cd ..`

Make sure you have a local elasticsearch running and start the server using:
`cd server && ruby app/bookshelf_api.rb`

Open the [admin page](http://localhost:4567/app/index.html#/admin) to add a few
books and then view a
[shelf](http://localhost:4567/app/index.html#/shelve/username).
