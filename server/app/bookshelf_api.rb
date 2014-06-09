require 'sinatra/base'
require 'elasticsearch'
require 'json'

class BooksRepository
    def initialize(esClient)
        @es = esClient
    end

    def all_books
        result = @es.search(
            :index => 'bookshelf',
            :type => 'books')
        getBooksFromEsResponse(result)
    end

    def get_shelf(userId)
        shelf = @es.get(
            :index => 'bookshelf',
            :type => 'shelves',
            :id => userId)

        books = @es.search(
            :index => 'bookshelf',
            :type => 'books',
            :body => {
                :filter => {
                    :ids => { :values => shelf['_source']['books']}
               }
            })

        getBooksFromEsResponse(books)
    rescue Elasticsearch::Transport::Transport::Errors::NotFound
        []
    end

    def update_shelf(userId, bookIds)
        @es.index(:index => 'bookshelf',
                  :type => 'shelves',
                  :id => userId,
                  :body => { :books => bookIds })
    end

    private

    def getBooksFromEsResponse(response)
        response['hits']['hits'].map { |hit|
            s = hit['_source']
            { id: hit['_id'], title: s['title'], author: s['author'] }
        }
    end

end

class BookshelfApi < Sinatra::Application
    configure do
        # abusing sinatras settings to inject dependency from tests
        esClient = (Elasticsearch::Client.new log: true)
        set :booksRepository => (BooksRepository.new esClient)

        set :public_folder => '../frontend/'
    end

    get '/api/books' do
        content_type :json
        settings.booksRepository.all_books.to_json
    end

    get '/api/shelves/:userId' do
        content_type :json
        settings.booksRepository.get_shelf(params['userId']).to_json
    end

    put '/api/shelves/:userId' do
        settings.booksRepository.update_shelf(
            params['userId'],
            JSON.parse(request.body.read))
        status 204
    end


    run! if app_file == $0
end
