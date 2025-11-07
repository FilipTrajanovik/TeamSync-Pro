import {useCallback, useEffect, useState} from "react";
import notificationRepository from "../repository/notificationRepository.js";


const useNotifications = (pollingInterval = 5000) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchMyNotifications = useCallback(() => {
        notificationRepository.getMyNotifications()
            .then((response) => {
                setNotifications(response.data);
                setLoading(false);
                console.log(`Successfully retrieved notifications`)
            }).catch((err) => {
            console.log(err);
        })
    }, [])

    const getUnreadNotifications = useCallback(() => {
        notificationRepository.getUnread()
            .then((response) => {
                setNotifications(response.data);
                setLoading(false);
                console.log(`Successfully retrieved unread notifications`)
            }).catch((err) => {
            console.log(err);
        })
    }, [])


    const fetchUnreadCount = useCallback(() => {
        notificationRepository.getUnreadCount()
            .then((response) => {
                setUnreadCount(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const markItAsRead = useCallback((id) => {
        notificationRepository.markItAsRead(id)
            .then(() => {
                console.log("Successfully marked a notification as read")
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const markItAsUnread = useCallback((id) => {
        notificationRepository.markItAsUnread(id)
            .then(() => {
                console.log("Successfully marked a notification as unread")
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        fetchUnreadCount()
    }, [fetchUnreadCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(!document.hidden){
                fetchUnreadCount()
            }
        }, pollingInterval)

        return () => clearInterval(interval)
    }, [fetchUnreadCount, pollingInterval])

    return {notifications, unreadCount, loading, fetchMyNotifications, getUnreadNotifications,fetchUnreadCount, markItAsRead, markItAsUnread}
}
export default useNotifications;