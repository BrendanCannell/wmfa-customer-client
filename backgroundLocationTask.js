import { TaskManager } from 'expo'

export let taskName = 'background-location-task'

export let define = () => {
  let onUpdate = null

  TaskManager.defineTask(taskName, async ({ data, error }) => {
    if (error) {
      console.error(error)
      return
    }
    
    let location = data.locations[0]

    if (location && onUpdate) {
      onUpdate(location)
    }
  })

  return fn => onUpdate = fn
}