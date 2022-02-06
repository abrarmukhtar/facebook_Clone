import React, { useEffect, useContext, useState } from 'react'
import "../rightbar/rightbar.css";
import { Users } from '../../dummyData'
import Online from '../online/Online';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { Add, Remove } from '@material-ui/icons'
export default function Rightbar({ user }) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([])
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));


  useEffect(() => {

    const fetchFriends = async () => {
      try {

        const res = await axios.get(`/users/friends/${user?._id}`)
        setFriends(res.data)
      } catch (error) {
        console.log(error)
      }

    }

    fetchFriends();

  },[user])

  useEffect(() => {

    setFollowed(currentUser.followings.includes(user?._id))

  },[currentUser, user])



  const handleClick = async () => {

    try {
      if (followed) {

        await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id })
          dispatch({type: "UNFOLLOW", payload: user._id})
      } else {
        await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id })
        dispatch({type: "FOLLOW", payload: user._id})

      }

      setFollowed(!followed);
    } catch (error) {

    }


  }



  const HomeRightbar = () => {
    return (<>
      <div className="birthdayContainer">
        <img className="birthdayImg" src={`${PF}/gift.png`} alt="" />
        <span className="birthdayText">
          <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
        </span>
      </div>
      <img className="rightbarAd" src={`${PF}/ad.png`} alt="" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map((u) => {
          return <Online key={u.id} user={u} />

        })}

      </ul>
    </>)
  }

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarfollowButton" onClick={handleClick}>
            {followed ? "unFollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "Other"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">

          {
            friends && friends.map(friend => {
              return (
                <Link to={`/profile/${friend.username}`} style={{ textDecoration: "none" }}>
                  <div className="rightbarFollowing">
                    <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
                      alt=""
                      className="rightbarFollowingImg"
                    />
                    <span className="rightbarFollowingName">{friend.username}</span>
                  </div>
                </Link>

              )
            })
          }

        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>

    </div>

  )
}
