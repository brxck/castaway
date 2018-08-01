# User for development
if Rails.env.development?
  user = User.create(email: "test@example.com", password: "hunter2")
  user.subscriptions.create(itunes_id: 947899573, # rubocop:disable Style/NumericLiterals
                            name: "The Adventure Zone",
                            feed: "http://adventurezone.libsyn.com/rss")
end
