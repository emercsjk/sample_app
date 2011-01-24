class WebserviceController < ApplicationController
  def req

      # Dummy-Request: Meldet immer erfolgreich
      render :json => {
          :id => params[:id],
          :statuscode => 200,
          :par => params[:data]
      }
  end

end
