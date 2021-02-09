import axios from 'axios';
import React, {Component}from 'react';
import SearchDiv from '../component/search-bar';
import VideoList from '../container/video-list';
import VideoDetails from '../component/video-detail';
import Video from '../component/video';

const API_END_POINT = 'https://api.themoviedb.org/3/';
const POPULAR_MOVIE_URL = 'discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images';
const API_KEY = 'api_key=b1bb009f89a909c0ae0b65bc17104e0e';
const SEARCH_URL = 'search/movie?language=fr&include_adult=false';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { movieList : {}, currentMovie: {} 
    }
  }
  
  componentWillMount(){
    this.getAxiosRes();
  }

  getAxiosRes(){
    axios.get(`${API_END_POINT}${POPULAR_MOVIE_URL}&${API_KEY}`).then(function (response){
      this.setState({movieList: response.data.results.slice(1,7), currentMovie : response.data.results[0]}, () =>{
        this.getVideoRes();
      });
      // console.log("nkjsfshofvjoperj", this.state.movieList);
    }.bind(this))
  }

  getVideoRes(){
    axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`).then(function(response) {
      if (response.data.videos && response.data.videos.results[0]) {
          const youtubeId = response.data.videos.results[0].key;
          let newCurrentMovie = this.state.currentMovie;
          newCurrentMovie.videoId = youtubeId;
          this.setState({currentMovie: newCurrentMovie, noVideo: '' });
      } else {
          this.setState({ noVideo: 'Video indisponible !!!'});
        }
      }.bind(this));
  }

  onClickListItem(movie){
    // console.log('-----');
    // console.log('-----je suis le grand parent-----', movie);
    // console.log('fnierhfefne');
    this.setState({currentMovie : movie}, () => {
        this.getVideoRes();
        this.setRecommandation();
    })
  }


  getTextSearch(textSearch) {
    axios.get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${textSearch}`).then(function (response){
      if (response.data && response.data.results[0]) {
        if(response.data.results[0].id != this.state.currentMovie.id) {
        this.setState({currentMovie: response.data.results[0] }, () => { 
          this.getVideoRes();
          this.setRecommandation();
        })
      }
    }
  }.bind(this));
}

setRecommandation() {
  axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&languages=fr`).then(function (response) {
    this.setState({movieList: response.data.results.slice(0,6)});
  }.bind(this))
}

  render(){
    const renderMoviesList = () => {
      if(this.state.movieList.length >= 6){
        return <VideoList listeFilms={this.state.movieList} callBack={this.onClickListItem.bind(this)}/>
      }
    }

    const renderNoVideo = () => {
      if(this.state.noVideo != '') {
        return <h1>{this.state.noVideo}</h1>
      }
    }

    return(
      <div>
        
          <div className="search_bar">
              <SearchDiv callBack={this.getTextSearch.bind(this)}/>
          </div>

          <div className="row">
              <div className="col-md-8">
                  <Video videoID={this.state.currentMovie.videoId}/>
                  <VideoDetails title={this.state.currentMovie.title} overview={this.state.currentMovie.overview} releasedate={this.state.currentMovie.release_date}/>
                  {renderNoVideo()}
              </div>
              <div className="col-md-4">
                  {renderMoviesList()}
              </div>
          </div>
      </div>
    )
  }
}

export default App;