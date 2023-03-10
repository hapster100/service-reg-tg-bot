import { writable } from "svelte/store"

export const Route = {
  MainMenu: '/',
  NewOrder: '/neworder',
  MyOrders: '/mylist',
  ServicesList: '/services',
  NewService: '/newservice',
  EditService: '/editservice',
  NewCategory: '/newcategory',
  EditCategory: '/editcategory',
  Shedulle: '/shedulle',
  Profile: '/profile',
}


export const initParams = new URLSearchParams(location.search)
export const currentPath = writable({
  path: Route.MainMenu,
  state: {}
})

type RouteKey = keyof typeof Route
type GoTo = { [key in RouteKey]: () => void }
type GoToWithState = { [key in RouteKey]: (state: object) => () => void } 

const addRoute = (acc: GoTo, key: RouteKey) => {
  acc[key] = () => {
    currentPath.set({ path: Route[key], state: {} })
  }
  return acc
}

const addStateRoute = (acc: GoToWithState, key: RouteKey) => {
  acc[key] = (state) => () => {
    currentPath.set({ path: Route[key], state })
  }
  return acc
}

export const goTo = Object.keys(Route).reduce(addRoute, {} as GoTo)
export const goToWithState = Object.keys(Route).reduce(addStateRoute, {} as GoToWithState)

currentPath.subscribe((newPath) => {
  history.pushState(newPath.state, '', newPath.path)
})

window.onpopstate = () => {
  history.back()
  currentPath.set({
    path: location.pathname,
    state: history.state,
  })
}
