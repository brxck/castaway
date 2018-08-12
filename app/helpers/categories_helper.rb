module CategoriesHelper 
  def active_category(category, class_string)
    class_string if current_page? category
  end

  def inactive_category(category, class_string)
    class_string unless current_page? category
  end
end
