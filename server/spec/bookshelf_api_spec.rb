require 'rspec'
require 'rack/test'
require 'sinatra'
require_relative '../app/bookshelf_api'

describe 'bookshelf API' do
    include Rack::Test::Methods

    def app
        BookshelfApi
    end

    before(:each) {
        BookshelfApi.set :esClient => es
    }

    let(:es) { double(Elasticsearch::Client) }

    let(:esBooksResponse) {
        return {
            'hits' => {
                'total' => 2,
                'hits' => [
                   { '_id' => 'i1', '_source' =>
                     { 'title' => 't1', 'author' => 'a1' } },
                   { '_id' => 'i2', '_source' =>
                     { 'title' => 't2', 'author' => 'a2' } },
                ]
            }
        }
    }


    it 'get /api/books returns a list of all books' do
        allow(es)
            .to receive(:search).with({
                :index => 'bookshelf',
                :type => 'books'
            })
            .and_return(esBooksResponse)

        get '/api/books'

        expect(last_response).to be_ok
        expect(last_response.content_type).to eq('application/json')
        expect(JSON.parse(last_response.body)).to eq([
                { 'id' => 'i1', 'title' => 't1', 'author' => 'a1' },
                { 'id' => 'i2', 'title' => 't2', 'author' => 'a2' }
        ])
    end

end
