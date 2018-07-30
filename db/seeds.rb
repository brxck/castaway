# User for development
if Rails.env.development?
  User.create(email: "test@example.com", password: "hunter2")
end
