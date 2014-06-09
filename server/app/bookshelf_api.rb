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
    end

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

    def initialize(app=nil)
        super(app)
        @repo = settings.booksRepository
    end

    get '/api/books' do
        content_type :json
        @repo.all_books.to_json
    end

    def getBooksFromEsResponse(response)
        response['hits']['hits'].map { |hit|
            s = hit['_source']
            { id: hit['_id'], title: s['title'], author: s['author'] }
        }
    end

    run! if app_file == $0
end
