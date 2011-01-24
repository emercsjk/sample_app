require 'spec_helper'

describe WebserviceController do

  describe "POST 'req'" do
    it "should be successful" do
      post 'req'
      response.should be_success
    end
  end

end
