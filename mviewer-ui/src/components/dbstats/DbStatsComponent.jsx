import React from 'react'
import dbStatsStyles from './dbstats.css'
import $ from 'jquery'



class DbStatsComponent extends React.Component {

  componentDidMount(){

    console.log('one');
   var that = this;

    $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        // url: 'http://172.16.55.42:8080/mViewer-0.9.2/services/db/test?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

        url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.props.connectionId,
        success: function(data) {
          console.log(data);
      

        },

        error: function(jqXHR, exception) {

        }


    });

}

  render () {

    console.log(this.props);
    return(
      <div className={dbStatsStyles.mainContainer}>
          DB stats
      </div>
    );
  }
}

export default DbStatsComponent;
