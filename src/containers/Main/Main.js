import React, { useState } from 'react';
import { Jumbotron, Button, Input } from 'reactstrap';
import axios from 'axios';

import './Main.css';

import MovieData from '../../components/MovieData/MovieData';
import Modal from '../../components/Modal/Modal';

const Main = () => {

    const [searchInput, setSearchInput] = useState("");

    const [isError, setIsError] = useState(false);
    const [errorInfo, setErrorInfo] = useState("The specified address was not find. Please paste Youtube or Vimeo link");
    const [showModal, setShowModal] = useState(false);

    const [videoPortal, setVideoPortal] = useState("");
    const [videoID, setVideoID] = useState("");
    const [videoName, setVideoName] = useState("");
    const [videoImg, setVideoImg] = useState("");

    const extVideoLinks = {
        youtu: {
            idlength: 11,
            address: "https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id="
        },
        vimeo: {
            idlength: 9,
            address: "https://api.vimeo.com/oauth/authorize/client"
        }
    }

    //const a = "http://www.youtube.com/watch?v=u8nQa1cJyX8"
    //console.log(a.split('v=')[1]);

    const searchHandler = (event) => {
        setSearchInput(event.target.value);
    }

    const findVideo = () => {

        let slashIndex = searchInput.lastIndexOf('/');
        let equalIndex = searchInput.lastIndexOf("=")
        let movieID, videoPortal;

        if (searchInput.includes(".")) {
            if (equalIndex > -1) {
                movieID = searchInput.substring(equalIndex+1, searchInput.length);
                setVideoID(movieID);
            } else {
                movieID = searchInput.substring(slashIndex+1, searchInput.length);
                setVideoID(movieID);
            }
            for (let vlink in extVideoLinks) {
                if (searchInput.includes(vlink)) {
                    setVideoPortal(vlink);
                    videoPortal = vlink;
                }
            }
        } else {
            movieID = searchInput;
            for (let vlink in extVideoLinks) {
                if (searchInput.length === extVideoLinks[vlink].idlength) {
                    setVideoID(movieID);
                    setVideoPortal(vlink);
                    videoPortal = vlink;
                }
            }
        }

        if (videoPortal) {
            sendQuery(movieID, videoPortal);
        } else {
            setIsError(true);
        }



        /*
        

        if (searchInput.length < 12) {
            setMovieID(searchInput);
            isRightAdress = true;
            for (let vlink in extVideoLinks) {
                if (searchInput.length === extVideoLinks[vlink].idlength) {
                    setVideoPortal(vlink);
                }
            }
        } else {
            for (let vlink in extVideoLinks) {
                if (searchInput.includes(vlink)) {
                    isRightAdress = true;
                    setVideoPortal(vlink);
                    setMovieID(searchInput.substring(searchInput.length-extVideoLinks[vlink].idlength, searchInput.length));
                }
            }
        }

        if (!isRightAdress) {
            setIsError(true);
        } else {
            setIsError(false);
            //sendQuery();
        }
        */
/*
        for (let vlink in videoLinks) {
            if (searchInput.includes(videoLinks[vlink])) {

                foundDomain = videoLinks[vlink]

                //const movieId = searchInput.split('=')

                //axios.get("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + movieId + "&key=" + `${process.env.REACT_APP_APIKEY}`)
                console.log(videoLinks[vlink])
            }
*/
    }

    const sendQuery = (movie, portal) => {

        switch(portal) {
            case "youtu":
                youtubeQuery(movie);
                break;
            case "vimeo":
                vimeoQuery(movie);
                break;
        }
    }

    const youtubeQuery = (movie) => {
        axios.get("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + movie + "&key=" + `${process.env.REACT_APP_APIYTKEY}`)
        .then(res => {
            setIsError(false);
            console.log(res.data);
            if (res.data.items.length > 0) {
                //setVID(res.data.items[0].id);
                setVideoName(res.data.items[0].snippet.title);
                setVideoImg(res.data.items[0].snippet.thumbnails.default.url);
            } else {
                setIsError(true);
                setErrorInfo("Error 404: The movie could not be found");
            }
        })
        .catch(err => {
            setIsError(true);
            setErrorInfo("Error " + err.response.status + ": " + err.response.data.error);
        })
    }

    const vimeoQuery = (movie) => {
        axios.post("https://api.vimeo.com/oauth/authorize/client", 
            { grant_type: 'client_credentials', scope: "public" },
            { headers: { Authorization: "Basic " + btoa(`${process.env.REACT_APP_APIVIMEOID}` + ":" + `${process.env.REACT_APP_APIVIMEOSECRET}`)}}
        )
        .then(res => {
            axios.get("https://api.vimeo.com/videos/" + movie,
            {headers: {
                Authorization: `bearer ${res.data.access_token}`
            }})
            .then(res => {
                setIsError(false);
                setVideoName(res.data.name);
                setVideoImg(res.data.pictures.sizes[1].link);
            })
            .catch(err => {
                setIsError(true);
                setErrorInfo("Error " + err.response.status + ": " + err.response.data.error);
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    const showPreview = () => {
        setShowModal(true);
    }

    const hidePreview = () => {
        setShowModal(false);
    }

    return(
        <React.Fragment>
            <Jumbotron className="Jumbotron">
                <h1 className="display-3">Welcome on VideoLista!</h1>
                <p className="lead">Create your amazing video list right now!</p>
                <hr className="my-3"/>
                <p className="lead">Past your video link here</p>
                <Input className="VideoInput" type="text" onChange={(event) => searchHandler(event)}></Input>
                <Button color="warning SearchBtn" size="lg" onClick={findVideo}>SEARCH</Button>
                {isError ? <p className="ErrorInfo">{errorInfo}</p> : null}
            </Jumbotron>
            <MovieData title={videoName} image={videoImg} preview={showPreview}/>
            <Modal 
                title={videoName}
                portal={videoPortal}
                movieid={videoID}
                show={showModal} 
                hide={hidePreview}/>
        </React.Fragment>
    )
}

export default Main;