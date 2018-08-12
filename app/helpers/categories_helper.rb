module CategoriesHelper 
  def active_category(category, class_string)
    class_string if current_page? category
  end

  def inactive_category(category, current_category, class_string)
    unless category.subcategories.include?(current_category) || current_page?(category)
      class_string
    end
  end
end
