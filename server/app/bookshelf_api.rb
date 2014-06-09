require 'sinatra/base'
require 'elasticsearch'
require 'json'

class BookshelfApi < Sinatra::Application
    configure do
        # abusing sinatras settings to inject dependency from tests
        set :esClient => (Elasticsearch::Client.new log: true)
    end

    def initialize(app=nil)
        super(app)
        @esClient = settings.esClient
    end

    get '/api/books' do
        content_type :json
        esResponse = @esClient.search :index => 'bookshelf', :type => 'books'
        getBooksFromEsResponse(esResponse).to_json
    end

    def getBooksFromEsResponse(response)
        response['hits']['hits'].map { |hit|
            s = hit['_source']
            { id: hit['_id'], title: s['title'], author: s['author'] }
        }
    end

    run! if app_file == $0
end
