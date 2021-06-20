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
    const [showModal, setShowModal] = useState(true);

    //const [videoPortal, setVideoPortal] = useState("");
    const [videoID, setVideoID] = useState("");

    const [videoData, setVideoData] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(0);
    //const [videoData2, setVideoData2] = useState([]);

    const [resNo, serResNo] = useState(100);

    const extVideoLinks = {
        youtu: {
            abbr: "youtu",
            idlength: 11,
            address: "http://www.youtube.com/watch?v="
        },
        vimeo: {
            abbr: "vimeo",
            idlength: 9,
            address: "https://vimeo.com"
        }
    }

    //const a = "http://www.youtube.com/watch?v=u8nQa1cJyX8"
    //console.log(a.split('v=')[1]);

    const searchHandler = (event) => {
        setSearchInput(event.target.value);
    }

    const enterListener = (event) => {
        if (event.charCode === 13) {
            findVideo();
        }
    }

    const findMovieId = (data) => {

        let movieID;
        let slashIndex = searchInput.lastIndexOf('/');
        let equalIndex = searchInput.indexOf("=");

        if (equalIndex > -1) {
            movieID = data.substring(equalIndex+1, equalIndex+12);
        } else {
            movieID = data.substring(slashIndex+1, data.length);
        }

        return movieID
    }

    const findVideo = () => {

        setVideoData([]);

        //let videoPortal;
        let option = 0;
        let videoPortal = null;
        let regexp1 = /^[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/;
        let regexp2 = /^\d{9}/

        if (searchInput.includes(".") && searchInput.includes("/")) {
            for (let vlink in extVideoLinks) {
                if (searchInput.length === extVideoLinks[vlink].idlength) {
                    //setVideoID(movieID);
                    //setVideoPortal(vlink);
                    videoPortal = vlink;
                }
            }
            option = 3;
            //console.log(equalIndex);
        }
        if (searchInput.length === extVideoLinks.youtu.idlength && regexp1.test(searchInput)) {
            option = 1;
        }
        if (searchInput.length === extVideoLinks.vimeo.idlength && regexp2.test(searchInput)) {
            option = 2;
        }

        switch(option) {
            case 1:
                //setVideoID(searchInput);
                //setVideoPortal("youtu");
                sendQuery(searchInput, "youtu");
                break;
            case 2:
                //setVideoID(searchInput);
                //setVideoPortal("vimeo");
                sendQuery(searchInput, "vimeo");
                break;
            case 3:
                let movieId = findMovieId(searchInput);
                //console.log(movieId);
                sendQuery(movieId, videoPortal);
                break;
            default: 
                vimeoSearch();
                youtubeSearch();
                console.log("default");
        }
/*
        if (searchInput.includes(".") && searchInput.includes("/")) {
            if (equalIndex > -1) {
                movieID = searchInput.substring(equalIndex+1, equalIndex+12);
                console.log(movieID);
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
*/
        //if (videoPortal) {
        //    sendQuery(videoID);
        //} else {
        //    setIsError(true);
        //}
    }

    const sendQuery = (movie, portal) => {

        switch(portal) {
            case "youtu":
                //console.log(videoPortal);
                youtubeQuery(movie);
                break;
            case "vimeo":
                vimeoQuery(movie);
                break;
            default:
                console.log(portal);
        }
    }

    const youtubeQuery = (movie) => {
        axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
            params: {
                part: 'snippet',
                id: movie,
                key: `${process.env.REACT_APP_APIYTKEY}`
            }
        })
        .then(res => {
            setIsError(false);
            if (res.data.items.length > 0) {
                let readyData = [];
                res.data.items.map((r, id) => {
                    return(
                        readyData.push({
                            name: r.snippet.title,
                            img: r.snippet.thumbnails.default.url,
                            link: extVideoLinks.youtu.address + r.id
                        })
                    );
                })
                setVideoData(videoData => [...videoData, {
                    name: res.data.items[0].snippet.title,
                    img: res.data.items[0].snippet.thumbnails.default.url,
                    link: extVideoLinks.youtu.address + movie,
                    portal: "youtube"
                }]);
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
            { headers: { Authorization: "Basic " + btoa(`${process.env.REACT_APP_APIVIMEOID}:${process.env.REACT_APP_APIVIMEOSECRET}`)}}
        )
        .then(res => {
            axios.get("https://api.vimeo.com/videos/" + movie,
            {headers: {
                Authorization: `bearer ${res.data.access_token}`
            }})
            .then(res => {
                setIsError(false);
                setVideoData(videoData => [...videoData, {
                    name: res.data.name,
                    img: res.data.pictures.sizes[1].link,
                    link: res.data.link,
                    portal: "vimeo"
                }]);     
                console.log(res.data);
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

    const youtubeSearch = () => {
        axios.get("https://youtube.googleapis.com/youtube/v3/search", {
            params: {
                part: 'snippet',
                q: searchInput,
                maxResults: 25,
                key: `${process.env.REACT_APP_APIYTKEY}`
            }
        })
        .then(res => {
            console.log(res.data);
            res.data.items.map((r, id) => {
                return(
                    setVideoData(videoData => [...videoData, ({
                        name: r.snippet.title,
                        img: r.snippet.thumbnails.default.url,
                        link: extVideoLinks.youtu.address + r.id.videoId,
                        portal: "youtube"
                    })])
                )
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    const vimeoSearch = () => {
        axios.post("https://api.vimeo.com/oauth/authorize/client", 
            { grant_type: 'client_credentials', scope: "public" },
            { headers: { Authorization: "Basic " + btoa(`${process.env.REACT_APP_APIVIMEOID}:${process.env.REACT_APP_APIVIMEOSECRET}`)}}
        )
        .then(res => {
            axios.get("https://api.vimeo.com/videos", {
                params: {
                    query: searchInput
                },
                headers: {
                    Authorization: `bearer ${res.data.access_token}`
                }
            })
            .then(res => {
                console.log(res.data);
                res.data.data.map((r, id) => {
                    return(
                        setVideoData(videoData => [...videoData, ({
                            name: r.name,
                            img: r.pictures.sizes[3].link,
                            link: r.link,
                            portal: "vimeo"
                        })])
                    );
                });
            })
            .catch(err => {
                setIsError(true);
                setErrorInfo(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    const showPreview = (event, id) => {
        console.log("aaaaa" + id);
        setCurrentVideo({
            name: videoData[id].name, 
            url: videoData[id].link,
            portal: videoData[id].portal
        })
        setShowModal(true);
    }

    const hidePreview = () => {
        setShowModal(false);
    }

    console.log(videoData);

    let movieData = <h3>Find something interesting!</h3>

    if (videoData.length > 0) {
        movieData = (
            <p>SEARCHING RESULT:</p>,
            videoData.map((r, id) => {
                console.log(id);
                return(
                    <MovieData 
                        key={id}
                        title={r.name} 
                        image={r.img}
                        portal={r.portal}
                        preview={(event) => showPreview(event, id)}/>
                )
        }))
    }

    return(
        <React.Fragment>
            <Jumbotron className="Jumbotron">
                <h1 className="display-3">Welcome on VideoLista!</h1>
                <p className="lead">Create your amazing video list right now!</p>
                <hr className="my-3"/>
                <p className="lead">Past your video link here</p>
                <Input 
                    className="VideoInput" 
                    type="text" 
                    onChange={(event) => searchHandler(event)}
                    onKeyPress={(event) => enterListener(event)}></Input>
                <Button color="warning SearchBtn" size="lg" onClick={findVideo}>SEARCH</Button>
                <Button color="secondary SearchBtn" size="lg" onClick={youtubeSearch}>SEARCH</Button>
                {isError ? <p className="ErrorInfo">{errorInfo}</p> : null}
            </Jumbotron>
            {movieData}
            <Modal 
                title={currentVideo.name}
                url={currentVideo.url}
                portal={currentVideo.portal}
                show={showModal} 
                hide={hidePreview}/>
        </React.Fragment>
    )
}

export default Main;