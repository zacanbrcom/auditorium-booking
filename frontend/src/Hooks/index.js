import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

import { useGlobalState } from 'State'

const shouldBackendWork = false

function getNamefromEmail(email) {
  return email.substring(0, email.lastIndexOf("@")).replace("."," ")
    .replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
}

export const api = axios.create({
  baseURL: shouldBackendWork
    ? 'http://localhost:8000/' // 'https://codeweek2019.kaifer.cz/api/'
    : 'http://localhost:8000/',
  timeout: 2000,
})

const useRerender = () => {
  const [, setB] = useState(true)
  return () => setB(b => !b)
}

export const useEvents = () => {
  const rerender = useRerender()
  const [apiState, setApiState] = useState({
    events: undefined,
    fetching: false,
    error: undefined,
    lastRequest: 0,
  })

  useEffect(() => {
    const pid = setInterval(() => {
      rerender()
    }, 1000)
    return () => {
      clearInterval(pid)
    }
  }, [rerender])

  /* eslint-disable-line */ useEffect(() => {
    if (!apiState.fetching && apiState.lastRequest < dayjs().valueOf() - 500) {
      setApiState(s => ({ ...s, fetching: true }))
      api
        .get('api/events/')
        .then(response => {
          setApiState(s => ({
            ...s,
            fetching: false,
            events: response.data
              .map(e => ({
                id: e[0],
                ...e[1],
                begin_time: dayjs(e[1].begin_time).valueOf(),
                end_time: dayjs(e[1].end_time).valueOf(),
              }))
              .map(e =>
                shouldBackendWork
                  ? e
                  : {
                      ...e,
                      north: e.rooms & 1,
                      south: e.rooms & 2,
                      rooms: undefined,
                    }
              )
              .map(e => {
                return { ...e, author_email: e.author, author_name: getNamefromEmail(e.author)}
              })
              .map(e => ({
                people: (JSON.stringify(e).length % 170) + 10,
                ...e,
              })),
            error: undefined,
            lastRequest: dayjs().valueOf(),
          }))
        })
        .catch(error => {
          setApiState(s => ({
            ...s,
            fetching: false,
            error: error,
            lastRequest: dayjs().valueOf(),
          }))
        })
    }
  })

  const forceRefresh = () =>
    setApiState(s => ({
      ...s,
      lastRequest: dayjs()
        .subtract(1, 'day')
        .valueOf(),
    }))
  const events = apiState.events === undefined ? [] : apiState.events

  return [events, forceRefresh]
}

export const useCreateEvent = onFinish => {
  const email = useUserEmail()

  const createEvent = async event => {
    const data = {
      ...event,
      begin_time: dayjs(event.begin_time).format(),
      end_time: dayjs(event.end_time).format(),
      layout: shouldBackendWork ? parseInt(event.layout) : parseInt(event.layout),
      rooms: (event.north ? 1 : 0) + (event.south ? 2 : 0),
      author: `${email}`,
    }

    if (event.people !== undefined) {
      data.people = shouldBackendWork ? parseInt(event.people) : parseInt(event.people)
    }

    await api
      .post('api/events/', data)
      .then(response => {
        if (response.data.result === 2) {
          alert('2 events cannot use the same auditorium at the same time.')
        } else if (response.data.result !== 0) {
          alert('Whoops. Something is broken. Please try again.')
        }
      })
      .catch(console.log)
    onFinish()
  }

  return createEvent
}

export const useUpdateEvent = () => {
  const updateEvent = id => event => {
    const data = {
      ...event,
    }
    if (event.begin_time !== undefined) {
      data.begin_time = dayjs(event.begin_time).format()
    }

    if (event.end_time !== undefined) {
      data.end_time = dayjs(event.end_time).format()
    }

    if (event.layout !== undefined) {
      data.layout = shouldBackendWork ? event.layout : parseInt(event.layout)
    }

    if (event.north !== undefined && event.south !== undefined) {
      data.rooms = (event.north ? 1 : 0) + (event.south ? 2 : 0)
    }

    if (event.people !== undefined) {
      data.people = shouldBackendWork ? event.people : parseInt(event.people)
    }

    api.patch(`api/events/${id}/`, data)
  }

  return updateEvent
}

export const useDisapprove = () => {
  const deleteEvent = useDeleteEvent()
  return id => deleteEvent(id)
}

export const useApprove = () => {
  return id => {
    api.post(`api/events/${id}/approve/`)
  }
}

export const useUserEmail = () => {
  const [globalState] = useGlobalState()

  return globalState.auth.user.email
}

export const useUserName = () => {
  const [globalState] = useGlobalState()

  return globalState.auth.user.displayName
}

export const useUserInfo = () => {
  const rerender = useRerender()
  const [apiState, setApiState] = useState({
    info: undefined,
    fetching: false,
    error: undefined,
    lastRequest: 0,
  })

  useEffect(() => {
    const pid = setInterval(() => {
      rerender()
    }, 1000)
    return () => {
      clearInterval(pid)
    }
  }, [rerender])

  /* eslint-disable-line */ useEffect(() => {
    if (!apiState.fetching && apiState.lastRequest < dayjs().valueOf() - 500) {
      setApiState(s => ({ ...s, fetching: true }))
      api
        .get('me/', {
          body: {},
        })
        .then(response => {
          if (response.data === undefined) throw Error
          setApiState(s => ({
            ...s,
            fetching: false,
            info: {
              ...response.data,
              role: { noob: 'Kámen', approver: 'Soulis' }[response.data.role],
            },
            error: undefined,
            lastRequest: dayjs().valueOf(),
          }))
        })
        .catch(error => {
          setApiState(s => ({
            ...s,
            fetching: false,
            error: error,
            lastRequest: dayjs().valueOf(),
          }))
        })
    }
  })

  return apiState.info !== undefined
    ? apiState.info
    : {
        role: 'Kámen',
      }
}

export const useUserRole = () => {
  const userInfo = useUserInfo()
  return userInfo.role
}

export const useDeleteEvent = () => {
  const deleteEvent = id => {
    api.delete(`api/events/${id}/`)
  }
  return deleteEvent
}
