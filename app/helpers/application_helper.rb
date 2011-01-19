module ApplicationHelper

  # Title-Tag: if no @title is defined, show base_title
  def title
    base_title = "OnMaCon - PSMT 2.0"
    if @title.nil?
      base_title
    else
      "#{base_title} | #{@title}"
    end
  end


end
