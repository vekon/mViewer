import React from 'react'
import collectionsStyles from './collections.css'
import QueryExecutor from '../queryexecutor/QueryExecutorComponent.jsx'
import $ from 'jquery'

class CollectionsComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {

      }
  }

  render () {
    console.log(this.props);

    return(
      <div className = {collectionsStyles.mainContainer}>
        <ul className={collectionsStyles.breadCrumb}>
          <li><a href="#">{this.props.location.query.db}</a></li>
          <li><a href="#">{this.props.location.query.collection}</a></li>
        </ul>
        <QueryExecutor ref='right' currentDb={this.props.location.query.db} currentCollection={this.props.location.query.collection} connectionId={this.props.connectionId}></QueryExecutor>
      </div>
    );
  }
}

export default CollectionsComponent;
