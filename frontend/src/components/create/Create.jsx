import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import classes from "./create.module.css";
import { useSelector } from "react-redux";

const Create = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [country, setCountry] = useState("")
  const [type, setType] = useState("")
  const [price, setPrice] = useState(0);
  const [review, setReview] = useState(0);
  const [typeError, setTypeError] = useState(false)
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth) 

  const changeImg = (e) => {
    setImg(e.target.files[0]);
  }

  const handleCloseImg = () => {
    setImg(null)
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const acceptableTypes = ['apartment', 'penthouse', 'bungalow', 'villa']

    if(!acceptableTypes.includes(type)){
      setTypeError(true)
      setTimeout(() => {
        setTypeError(false)
      }, 1000 * 10)
      return
    }

    try {
      const formData = new FormData();

      let filename = null;
      if (img) {
        filename = Date.now() + img.name;
        formData.append("filename", filename);
        formData.append("image", img);

        await fetch(`http://localhost:5000/upload/image`, {
          headers : {
            'Authorization': `Bearer ${token}`
          },
          method: "POST",
          body: formData,
        });

      const res = await fetch("http://localhost:5000/room", {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          country,
          type,
          photo: filename,
          price,
          review,
        }),
      });
      const newRoom = await res.json();
      navigate(`/typeDetail/${newRoom?._id}`);
    }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Create new room</h2>
        <form onSubmit={handleCreateProduct} encType="multipart/form-data">
          <div className={classes.inputWrapper}>
           <label>Tittle:</label>
           <input type= "text" onChange={(e) => setTitle(e.target.value)} className={classes.input} placeholder="Title..."/>
          </div>
          <div className={classes.inputWrapper}>
           <label>Description:</label>
           <input type= "text" onChange={(e) => setDesc(e.target.value)} className={classes.input} placeholder="Description..."/>
          </div>
          <div className={classes.inputWrapper}>
           <label>Country:</label>
           <input type= "text" onChange={(e) => setCountry(e.target.value)} className={classes.input} placeholder="Country..."/>
          </div>
          <div className={classes.inputWrapper}>
           <label>Type:</label>
           <input type= "text" onChange={(e) => setType(e.target.value)} className={classes.input} placeholder="Type..."/>
          </div>
          <div className={classes.inputWrapperImg}>
            <label className={classes.fileInputLabel} htmlFor="img" >
              Image: <span>Upload here</span>
            </label>
            <input
              type="file" filename="img" id="img" onChange={changeImg} style={{display: "none"}}
            />
            {img && <p className={classes.imageName}>{img.name} <AiOutlineCloseCircle className={classes.icon} onClick={() => handleCloseImg()}/></p>}
          </div>
          <div className={classes.inputWrapper}>
            <label >Price: </label>
            <input
              step={0.01}
              onChange={(e) => setPrice(e.target.value)}
              className={classes.input}
              type="number"
              placeholder="Price..."
            />
          </div>
          <div className={classes.inputWrapper}>
            <label >Review: </label>
            <input
              min={1}
              max={5}
              step={0.1}
              onChange={(e) => setReview(e.target.value)}
              className={classes.input}
              type="number"
              placeholder="Review..."
            />
          </div>
          <div className={classes.buttonWrapper}>
            <button className={classes.submitBtn} type="submit">
              Create Room
            </button>
          </div>
        </form>
        {typeError &&
        <div className={classes.errorMessage}>
          Wrong Type! Acceptable types are - apartment, villa, penthouse and bungalow
        </div>}
      </div>
    </div>
  );
};

export default Create;