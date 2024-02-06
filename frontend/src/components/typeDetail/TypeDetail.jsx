import React from "react"
import classes from './typeDetail.module.css'
import { AiFillStar } from "react-icons/ai"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDatesInRange, isUnavailable } from "../../utils/dateFunc"



const TypeDetail = () => {
  const [roomDetails, setRoomDetails] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const {token} = useSelector((state) => state.auth)
  const id = useParams().id
  const containerRef = useRef()

  useEffect(() => {
    const fetchRoom = async() => {
    const res = await fetch (`http://localhost:5000/room/find/${id}`,{
      headers : {
        'Authorization': `Bearer ${token}`
      } 
    })

    const room = await res.json()
    setRoomDetails(room)
  }
  fetchRoom() 
  }, [id])

  useEffect(() =>{
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const yourBookedDates = getDatesInRange(startDate, endDate)
    const isUnavailableDates = isUnavailable(roomDetails, yourBookedDates)
    if(isUnavailableDates){
      const lastAvailableDate = new Date(roomDetails.isUnavailableDates[roomDetails.isUnavailableDates.legth - 1])
      const lastAvailableDay = lastAvailableDate.getDate()
      const lastAvailableMonth = lastAvailableDate.getMonth()

      const formattedMonth = (lastAvailableMonth + 1 ) > 9 ? `${lastAvailableMonth + 1}` : `0${lastAvailableMonth}` 
      const formattedDay = lastAvailableDay > 9 ? `${lastAvailableDay}` : `0${lastAvailableDay + 1}`

      const formattedDayAndMonth = `${formattedDay}-${formattedMonth}`
      setError(formattedDayAndMonth)
      setTimeout(() => {
        setError(false)
      }, 5000)
      return
    }

    try{
      const res = await fetch ( `https://localhost:5000/room/bookRoom/${id}`,{
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        method : "PUT",
        body : JSON.stringify({username, email, isUnavailableDates, yourBookedDates})
      })
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
      }, 5000)

      const updatedRoom = await res.json()
      setRoomDetails(updatedRoom)
    } catch (error) {
      console.error(error.message)
    }
  }

  return(
    <div ref ={containerRef} className={classes.container}>
      <div className={classes.wrapper}>
      <div className={classes.left}>
        <div className={classes.imgwrapper}>
          <img src = {`http://localhost:5000/images/${roomDetails?.photo}`} />
        </div>
       </div>
       <div className={classes.right}>
        <h2 className={classes.title}>{roomDetails.title}</h2>
        <p className={classes.type}>Type: <span>{roomDetails.type}</span></p>
        <div className={classes.review}>Review: <AiFillStar className={classes.icon}/>{roomDetails?.review}</div>
        <p className={classes.desc}>
          <span>Description: </span>
          {roomDetails?.desc}
        </p>
        <p className={classes.roomDetails}>Country: <span>{roomDetails.country}</span></p>
        <p className={classes.review}>Review: <span>{roomDetails.review}</span></p>
        <form className={classes.typeDetailForm} oSubmit ={handleSubmit}>
          <h3>Enter information here</h3>
          <input type="text" placeholder="Full Name" onChange={(e) => setUsername(e.target.value)}></input>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} ></input>
          <div className={classes.datContiner}>
            <input type = "date" onChange={(e) => setStartDate(e.target.value)} />
            <input type = "date" onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button type="submit" className={classes.bookNow}>Book now</button>
        </form>
        {error &&
        <div className={classes.errorMessage}>
          Your date is in booked range!
          Last booked day is {error}
          </div>}
          {success &&
          <div className={classes.successMessage}>
            Success! You booked from {startDate} to {endDate}</div>}
       </div>
       </div>
     </div>    
  )
}


export default TypeDetail
