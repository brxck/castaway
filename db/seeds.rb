# User for development
if Rails.env.development?
  user = User.create!(email: "test@example.com", password: "hunter2")
  user.subscriptions.create!(itunes_id: 947899573, # rubocop:disable Style/NumericLiterals
                            name: "The Adventure Zone",
                            feed: "http://adventurezone.libsyn.com/rss")
end

# Load iTunes genres into database
genres_url = "https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/genres?id=26"

genres = JSON.parse(Connect.get(genres_url).body)["26"]["subgenres"]

genres.each do |_, genre|
  parent = Category.create!(id: genre["id"], name: genre["name"])

  if genre["subgenres"]
    genre["subgenres"].each do |_, subgenre|
      parent.subcategories.create!(id: subgenre["id"], name: subgenre["name"])
    end
  end
end

# Load curated podcasts from file
file = File.new(Rails.root.join("db", "curated.yml"))
curated = YAML.safe_load(file)

curated.each do |_, id|
  CuratedPodcast.create!(id: id)
end

# Preload top podcasts
PreloadToplistJob.perform_later
