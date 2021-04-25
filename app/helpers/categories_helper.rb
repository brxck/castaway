module CategoriesHelper
  def is_active?(category)
    active_child = category.subcategories.any? { |sc| current_page? sc }
    current_page?(category) || active_child
  end
end
