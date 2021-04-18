source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "~> 3.0.1"

gem "rails", "~> 6.1", ">= 6.1.3"
gem "pg", "~> 1.2", ">= 1.2.3"
gem "puma", "~> 5.2", ">= 5.2.2"
gem "sass-rails", "~> 6.0"
gem "uglifier", "~> 4.2"
gem 'hotwire-rails', "~> 0.1.3"
gem "jbuilder", "~> 2.11", ">= 2.11.2"

gem "devise", "~> 4.7", ">= 4.7.3"
gem "faraday", "~> 1.3"
gem "feedjira", "~> 2.1", ">= 2.1.4"
gem "feedjira-podcast", "~> 0.10.0"
gem "normalize-rails", "~> 8.0", ">= 8.0.1"
gem "pagy", "~> 4.1"
gem "slim-rails", "~> 3.2"
gem "material_design_icons",
    github: "barrymieny/material_design_icons",
    tag: "v2.5.94"
gem "bootsnap", "~> 1.7", ">= 1.7.2", require: false

group :development, :test do
  gem "byebug", platforms: %i[mri mingw x64_mingw]
end

group :development do
  gem "listen", "~> 3.4", ">= 3.4.1"
  gem "web-console", "~> 4.1"
  gem "irbtools", require: "irbtools/binding"
  gem "prettier"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]
