require 'test_helper'

class PodcastControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get podcast_show_url
    assert_response :success
  end

  test "should get listen" do
    get podcast_listen_url
    assert_response :success
  end

  test "should get subscribe" do
    get podcast_subscribe_url
    assert_response :success
  end

end
