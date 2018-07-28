const { environment } = require("@rails/webpacker")

const pugConfig = require("./pug-loader")
environment.config.merge(pugConfig)

module.exports = environment
