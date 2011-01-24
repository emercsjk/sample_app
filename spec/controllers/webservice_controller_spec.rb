require 'spec_helper'

describe WebserviceController do

  describe "GET 'req'" do
    it "should be successful" do
      get 'req'
      response.should be_success
    end
  end

end
