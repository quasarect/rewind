import { useState, useCallback, useEffect } from 'react'

import Notification from '../components/notifications/Notification'

import { useHttpClient } from '../hooks/httpRequest'

function Notifications() {
  const [newNotifications, setNewNotifications] = useState([])
  const [seenNotifications, setSeenNotifications] = useState([])

  const { isLoading, sendRequest } = useHttpClient()
  const { sendRequest: seenNotif } = useHttpClient()

  const getNotifications = useCallback(async () => {
    try {
      const response = await sendRequest('/user/notifications')
      setNewNotifications(response.notifications.newNotifications)
      setSeenNotifications(response.notifications.seenNotifications)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    getNotifications()
  }, [])

  useEffect(() => {
    const notifs = [...newNotifications]

    notifs.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    let id = notifs[0]?._id

    try {
      seenNotif('/user/notifications/seen?id=' + id)
    } catch (err) {
      console.log(err)
    }
  }, [newNotifications])

  return (
    <main className="w-full h-fit pb-16 md:pb-0 md:w-4/5 lg:w-2/5 bg-rewind-dark-primary">
      <div className="p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary">
        Notifications
      </div>
      <div>
        {isLoading && (
          <div className="p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary">
            Loading...
          </div>
        )}
        {newNotifications.map((notification) => {
          return (
            <Notification
              notification={notification}
              key={notification?._id}
              newNotification={true}
            />
          )
        })}
        {seenNotifications.map((notification) => {
          return (
            <Notification
              notification={notification}
              key={notification?._id}
              newNotification={false}
            />
          )
        })}
      </div>
    </main>
  )
}

export default Notifications
