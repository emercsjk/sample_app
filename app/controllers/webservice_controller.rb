class WebserviceController < ApplicationController
  def req

      # Dummy-Request: Meldet immer erfolgreich
      myRequest = {
          :id => params[:id],
          :statuscode => 200,
          :par => params[:data]
      }
      render :json => myRequest
  end

end
