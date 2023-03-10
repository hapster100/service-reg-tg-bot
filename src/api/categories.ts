import { Category } from "../models/Category"
import { baseApiFetch, type NoId } from "./base"


export async function getAllCategories(): Promise<Category[]> {
  const res = await baseApiFetch('/categories')
  const json = await res.json()
  const categories = json.categories.map(raw => new Category(raw)) as Category[]
  categories.sort((c1, c2) => c2.priority - c1.priority)
  return categories
}

export async function addCategory(category: NoId<Category>) {
  const body = { category }
  const res = await baseApiFetch('/categories', 'POST', body)
  return res.json()
}

export async function updateCategory(category: Category) {
  const body = { category }
  const res = await baseApiFetch('/categories/' + category.id, 'PUT', body)
  return res.json()
}

export async function deleteCategory(id: string) {
  const res = await baseApiFetch('/categories/' + id, 'DELETE')
  return res.json()
}
