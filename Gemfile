source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.1"

# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem 'rails', '~> 6.1', '>= 6.1.3'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.2', '>= 1.2.3'
# Use Puma as the app server
gem 'puma', '~> 5.2', '>= 5.2.2'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 6.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 4.2'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.2', '>= 5.2.1'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem "mini_racer", platforms: :ruby

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5.2', '>= 5.2.1'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.11', '>= 2.11.2'
# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"
# Use ActiveModel has_secure_password
# gem "bcrypt", "~> 3.1.7"

# Use ActiveStorage variant
# gem "mini_magick", "~> 4.8"

# Use Capistrano for deployment
# gem "capistrano-rails", group: :development

# Authentication
gem 'devise', '~> 4.7', '>= 4.7.3'
# Make http requests
gem 'faraday', '~> 1.3'
# Parse podcast feeds
gem 'feedjira', '~> 2.1', '>= 2.1.4'
gem 'feedjira-podcast', '~> 0.10.0'
# CSS reset
gem 'normalize-rails', '~> 8.0', '>= 8.0.1'
# Exciting new pagination gem
gem 'pagy', '~> 4.1'
# HTML templating
gem 'slim-rails', '~> 3.2'

gem 'material_design_icons', :github => 'barrymieny/material_design_icons', tag: 'v2.5.94'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '~> 1.7', '>= 1.7.2', require: false

group :development, :test do
  # Call "byebug" anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling "console" anywhere in the code.
  gem 'web-console', '~> 4.1'
  gem 'listen', '~> 3.4', '>= 3.4.1'
  # Better irb
  gem "irbtools", require: "irbtools/binding"
  # Task automation
  gem "guard"
  gem "guard-livereload"
  # Linting
  gem "rubocop"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", ">= 2.15", "< 4.0"
  gem "selenium-webdriver"
  # Easy installation and use of chromedriver to run system tests with Chrome
  gem "chromedriver-helper"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
