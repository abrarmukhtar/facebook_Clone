import React, { useState, useEffect, useContext } from 'react'
import './post.css'
import {  MoreVert } from "@material-ui/icons";
import axios from 'axios';
import {format} from 'timeago.js'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'


export default function Post({ post }) {
const {user: currentUser} = useContext(AuthContext);

  const [user, setUser]=useState({})
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsliked] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(()=>{
        setIsliked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes])


  useEffect(()=>{

    const fetchUser = async ()=>{
      const res = await axios.get(`/users?userId=${post.userId}`)
      setUser(res.data)
      
    }
  
    fetchUser();
  },[post.userId])
  
  
  const likeHandler = () => {

    try {
       axios.put(`/posts/${post._id}/like`, {userId: currentUser._id})
    } catch (error) {
      console.log(error);
    }

    setLike(isLiked ? like - 1 : like + 1)
    setIsliked(!isLiked)

  }

  

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
          <Link to={`/profile/${user.username}`}>  
          <img
              className="postProfileImg"
              src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"}

              alt="postProfileImg"
            />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate"> {format(post.createdAt) }</span>

          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF+post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter"> {like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText"> 9 comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
