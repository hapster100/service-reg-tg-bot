import { writable } from "svelte/store"

export const Route = {
  MainMenu: '/',
  NewOrder: '/neworder',
  MyOrders: '/mylist',
  ServicesList: '/services',
  NewService: '/newservice',
  NewCategory: '/newcategory',
  Shedulle: '/shedulle',
}


export const currentPath = writable(Route.MainMenu)

type RouteKey = keyof typeof Route
type GoTo = { [key in RouteKey]: () => void }
const addRoute = (acc: GoTo, key: RouteKey) => {
  acc[key] = () => {
    currentPath.set(Route[key])
  }
  return acc
}
export const goTo = Object.keys(Route).reduce(addRoute, {} as GoTo)

currentPath.subscribe((newPath) => {
  history.pushState({}, '', newPath)
})

window.onpopstate = () => {
  history.back()
  currentPath.set(location.pathname)
}
