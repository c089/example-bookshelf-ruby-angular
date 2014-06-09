require 'rspec'
require 'rack/test'
require 'sinatra'
require_relative '../app/bookshelf_api'

describe 'Bookshelf API server' do

    let(:booksInApiFormat) {
        [ { id: 'i1', title: 't1', author: 'a1' },
          { id: 'i2', title: 't2', author: 'a2' } ]
    }

    describe BooksRepository do
        let(:repo) { BooksRepository.new esClient }
        let(:esClient) { double(Elasticsearch::Client) }
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

        describe 'all_books' do
            it 'uses a match all search to get all books' do
                expect(esClient)
                    .to receive(:search).with({
                        :index => 'bookshelf',
                        :type => 'books'
                    })
                    .and_return(esBooksResponse)

                expect(repo.all_books).to eq(booksInApiFormat)
            end
        end

        describe 'get_shelf' do
            it 'loads all books from a users shelf' do
                ids = ['i1', 'i2']
                expect(esClient).to receive(:get)
                    .with(:index => 'bookshelf',
                          :type => 'shelves',
                          :id => 'bestuserever')
                    .and_return({ '_source' => { 'books' => ids}})

                expect(esClient).to receive(:search)
                    .with(:index => 'bookshelf',
                          :type => 'books',
                          :body => {
                              :filter => {
                                  :ids => { :values => ids }
                             }
                          })
                   .and_return(esBooksResponse)

                books = repo.get_shelf('bestuserever')

                expect(books).to eq(booksInApiFormat)
            end
        end

    end

    describe BookshelfApi do

        include Rack::Test::Methods

        def app
            BookshelfApi
        end


        let(:repo) { double(BooksRepository) }

        before(:each) {
            BookshelfApi.set :booksRepository => repo
        }

        describe 'GET /api/books' do
            it 'get /api/books returns a list of all books' do
                expect(repo)
                    .to receive(:all_books)
                    .and_return(booksInApiFormat)

                get '/api/books'

                expect(last_response).to be_ok
                expect(last_response.content_type).to eq('application/json')
                expect(last_response.body).to eq(booksInApiFormat.to_json)
            end
        end

        describe 'GET /api/shelves/:userId' do
            it 'loads books on users shelf' do
                expect(repo)
                    .to receive(:get_shelf).with('bestuserever')
                    .and_return(booksInApiFormat)

                get '/api/shelves/bestuserever'

                expect(last_response).to be_ok
                expect(last_response.content_type).to eq('application/json')
                expect(last_response.body).to eq(booksInApiFormat.to_json)
            end
        end
    end

end
