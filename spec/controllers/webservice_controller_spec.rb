require 'spec_helper'

describe WebserviceController do

  describe "GET 'request'" do
    it "should be successful" do
      get 'request'
      response.should be_success
    end
  end

end
