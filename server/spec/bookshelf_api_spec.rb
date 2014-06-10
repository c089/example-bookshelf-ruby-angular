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
                        :type => 'books',
                        :size => 9999
                    })
                    .and_return(esBooksResponse)

                expect(repo.all_books).to eq(booksInApiFormat)
            end
        end

        describe 'create_book' do
            it 'indexes the new book in elasticsearch' do
                book = { title: 't', author: 'a', image: 'i' }

                expect(esClient).to receive(:index)
                    .with(:index => 'bookshelf',
                          :type => 'books',
                          :body => book)
                    .and_return({
                        created: true,
                        _id: 'generated_id'
                    })
                expect(esClient).to receive_message_chain(:indices, :refresh)
                    .with(:index => 'bookshelf')

                new_book = repo.create_book(book)
                expect(new_book[:id]).to eq('generated_id')
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
                          :size => 2,
                          :body => {
                              :filter => {
                                  :ids => { :values => ids }
                             }
                          })
                   .and_return(esBooksResponse)

                books = repo.get_shelf('bestuserever')

                expect(books).to eq(booksInApiFormat)
            end

            it 'returns empty list if the user does not have a shelf yet' do
                expect(esClient).to receive(:get).and_raise(
                    Elasticsearch::Transport::Transport::Errors::NotFound)

                expect(repo.get_shelf('iamanewuser')).to eq []
            end
        end

        describe 'update_shelf' do
            it 'sends the new shelf data to elasticsearch' do
                userId = 'foo'
                bookIds = ['i1', 'i2']

                expect(esClient)
                    .to receive(:index)
                    .with(:index => 'bookshelf',
                          :type => 'shelves',
                          :id => userId,
                          :body => { :books => bookIds })

                repo.update_shelf(userId, bookIds)
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

        describe 'POST /api/books' do
            def stringify_keys(x)
                JSON.parse(x.to_json)
            end

            it 'creates a new book' do
                book = { title: 't', author: 'a', image: 'i' }
                bookWithId = book.clone
                bookWithId['id'] =  'i'

                expect(repo)
                    .to receive(:create_book)
                    .with(stringify_keys(book))
                    .and_return(bookWithId)

                post '/api/books', book.to_json

                expect(last_response.status).to eq 201
                expect(last_response.content_type).to eq('application/json')
                expect(last_response.body).to eq(bookWithId.to_json)
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

        describe 'PUT /api/shelves/:userId' do
            it 'updates the shelf' do
                username = 'x'
                ids = ['a', 'b', 'c']

                expect(repo).to receive(:update_shelf).with(username, ids)

                put '/api/shelves/' + username, ids.to_json

                expect(last_response.status).to eq(204)
            end
        end
    end

end
