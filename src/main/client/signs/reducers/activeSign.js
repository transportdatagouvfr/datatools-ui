import update from 'react-addons-update'

const activeSign = (state = null, action) => {
  let entities, foundIndex, displayIndex
  switch (action.type) {
    case 'UPDATE_ACTIVE_SIGN':
      console.log('update active sign', action.sign)
    case 'CREATE_SIGN':
    case 'EDIT_SIGN':
      return action.sign

    case 'SET_ACTIVE_SIGN_TITLE':
      return update(state, {title: {$set: action.title}})
    case 'SET_ACTIVE_SIGN_DESCRIPTION':
      console.log(action)
      return update(state, {description: {$set: action.description}})
    case 'SET_ACTIVE_SIGN_URL':
      return update(state, {url: {$set: action.url}})
    case 'SET_ACTIVE_SIGN_CAUSE':
      return update(state, {cause: {$set: action.cause}})
    case 'SET_ACTIVE_SIGN_EFFECT':
      return update(state, {effect: {$set: action.effect}})
    case 'SET_ACTIVE_SIGN_START':
      return update(state, {start: {$set: parseInt(action.start)}})
    case 'SET_ACTIVE_SIGN_END':
      return update(state, {end: {$set: parseInt(action.end)}})
    case 'SET_ACTIVE_SIGN_PUBLISHED':
      return update(state, {published: {$set: action.published}})
    case 'RECEIVED_GTFS_ENTITIES':
      // TODO: update GTFS entities for active sign
      if (state !== null && state.affectedEntities !== null) {
        for (var i = 0; i < action.gtfsObjects.length; i++) {
          let ent = action.gtfsObjects[i]
          if (typeof ent.gtfs !== 'undefined' && ent.SignId === state.id) {
            // let sign = action.gtfsSigns.find(a => a.id === ent.entity.SignId)
            let updatedEntity = state.affectedEntities.find(e => e.id === ent.entity.Id)
            updatedEntity[ent.type] = ent.gtfs
            entities.push(selectedEnt)
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
          }
        }
        return update(state, {affectedEntities: {$set: entities}})
      }
      return state
    case 'ADD_ACTIVE_SIGN_AFFECTED_ENTITY':
      entities = [...state.affectedEntities, action.entity]
      return update(state, {affectedEntities: {$set: entities}})
    case 'UPDATE_DISPLAYS':
      return update(state, {displays: {$set: action.displays}})
    case 'TOGGLE_ASSOCIATED_SIGN':
      displayIndex = state.displays.findIndex(d => d.Id === action.display.Id)
      return update(state, {displays: {[displayIndex]: {$merge: {DraftDisplayConfigurationId: action.draftConfigId}}}})
    case 'UPDATE_ACTIVE_SIGN_ENTITY':
      console.log('update entity', action.entity, action.field, action.value)
      foundIndex = state.affectedEntities.findIndex(e => e.id === action.entity.id)
      if (foundIndex !== -1) {
        switch (action.field) {
          case 'TYPE':
            let updatedEntity = update(action.entity, {
              type: {$set: action.value},
              stop: {$set: null},
              route: {$set: null},
              stop_id: {$set: null},
              route_id: {$set: null}
            })
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
            return update(state, {affectedEntities: {$set: entities}})
          case 'AGENCY':
            updatedEntity = update(action.entity, {agency: {$set: action.value}})
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
            return update(state, {affectedEntities: {$set: entities}})
          case 'MODE':
            updatedEntity = update(action.entity, {mode: {$set: action.value}})
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
            return update(state, {affectedEntities: {$set: entities}})
          case 'STOP':
            let stopId = action.value !== null ? action.value.stop_id : null
            updatedEntity = update(action.entity, {
              stop: {$set: action.value},
              stop_id: {$set: stopId},
              agency: {$set: action.agency},
              route: {$set: null},
              route_id: {$set: null}
              // TODO: update agency id from feed id?
            })
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
            return update(state, {affectedEntities: {$set: entities}})
          case 'ROUTE':
            let routeId = action.value !== null ? action.value.route_id : null
            updatedEntity = update(action.entity, {
              route: {$set: action.value},
              route_id: {$set: routeId},
              agency: {$set: action.agency},
              stop: {$set: null},
              stop_id: {$set: null}
              // TODO: update agency id from feed id?
            })
            entities = [
              ...state.affectedEntities.slice(0, foundIndex),
              updatedEntity,
              ...state.affectedEntities.slice(foundIndex + 1)
            ]
            return update(state, {affectedEntities: {$set: entities}})
        }
      }
      return state
    case 'DELETE_ACTIVE_SIGN_AFFECTED_ENTITY':
      foundIndex = state.affectedEntities.findIndex(e => e.id === action.entity.id)
      if (foundIndex !== -1) {
        entities = [
          ...state.affectedEntities.slice(0, foundIndex),
          ...state.affectedEntities.slice(foundIndex + 1)
        ]
        return update(state, {affectedEntities: {$set: entities}})
      }
      return state

    default:
      return state
  }
}

export default activeSign