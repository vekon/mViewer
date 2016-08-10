import React from 'react'
import homeStyles from './home.css'
import $ from 'jquery'
import CreatDb from '../createdb/CreateDbComponent.jsx'



class HomeComponent extends React.Component {

  render () {

    return(
      <div className={homeStyles.mainContainer}>
           <CreatDb></CreatDb>
      </div>
    );
  }
}

export default HomeComponent;
