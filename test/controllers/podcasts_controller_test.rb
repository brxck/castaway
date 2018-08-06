require 'test_helper'

class PodcastsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get podcasts_show_url
    assert_response :success
  end

  test "should get listen" do
    get podcasts_listen_url
    assert_response :success
  end

  test "should get subscribe" do
    get podcasts_subscribe_url
    assert_response :success
  end

end
