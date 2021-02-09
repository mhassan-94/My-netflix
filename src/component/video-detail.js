import React from 'react';

const VideoDetails = (props) => {
    const title = props.title;
    const overview = props.overview;
    // const releasedate = props.releasedate;
    return(
        <div>
            <h1>{title}</h1>
            <p>{overview}</p>
            {/* <div>{releasedate}</div> */}
        </div>
    )
}

export default VideoDetails;