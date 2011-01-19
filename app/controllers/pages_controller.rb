class PagesController < ApplicationController
  def home
    @title = "Home"
  end

  def contact
    @title = "Contact"
  end

  def about
    @title = "About"
  end

  def report
    @rowsCount = 666
    @title = "Reporting #{@rowsCount} rows"
  end

end
