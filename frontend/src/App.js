import {useEffect, useState} from "react";
import axios from "axios";
import './App.css';

function App() {

  const CLIENT_ID = "7038065ef018407eb8d28e7e565c8d49";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("")
  const [searchArtist, setSearchArtist] = useState("")
  const [tracks, setTracks] = useState("")
  const [artists, setArtists] = useState([])

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expires_in");
  }

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    let expires_in = window.localStorage.getItem("expires_in");

    if(!token && hash){
      console.log(hash)
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      expires_in = hash.substring(1).split("&")[2].split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("expires_in", expires_in);
    }
    setToken(token);

    // Multiply expires_in times 1000 since unit for setTimeout is ms
    const timeout = setTimeout(logout, expires_in * 1000);
    console.log(expires_in);

    return () => clearTimeout(timeout);


  }, [logout])

  const searchArtists = async (event) => {
    event.preventDefault();
    console.log(token);
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchArtist,
                type: "artist"
            }
    })
    console.log(data)
    setArtists(data.artists.items)
  }

  const searchTopTracksByArtist = async (event) => {
    event.preventDefault();
    console.log(token);
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchArtist,
                type: "artist"
            }
    })
    console.log(data)
    //setTracks(data..items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {/* {artist.images.length ? <img width = "100%" src={artist.images[0].url}/> : <div>No images</div>} */}
        <h2>{artist.name}</h2>
      </div>
    ));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Spotify (Fun Version)!</h1>
        {!token ? 
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
          Login to Spotify
        </a>: 
        <button onClick = {logout} >Logout</button>}

        {token ? 
          <form onSubmit = {searchArtists}>
            <input type = "text" onChange = {event => setSearchArtist(event.target.value)}/>
            <button type = {"submit"}>Search</button>
          </form>:
          <h2>Please login.</h2>
        }

        {renderArtists()}

      </header>
    </div>
  );
}

export default App;
