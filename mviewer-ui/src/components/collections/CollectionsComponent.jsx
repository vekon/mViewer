import React from 'react'
import collectionsStyles from './collections.css'
import QueryExecutor from '../queryexecutor/QueryExecutorComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

class CollectionsComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {

      }
  }

  render () {
    return(
      <div className = {collectionsStyles.mainContainer}>
        <ul className={collectionsStyles.breadCrumb}>
          <li><a href="#">{this.props.location.query.db}</a></li>
          <li><a href="#">{this.props.location.query.collection}</a></li>
        </ul>
        <Tabs selectedIndex={0}>
          <TabList>
            <Tab>Query Executor</Tab>
            <Tab>Add Document</Tab>
            <Tab>Update Collection</Tab>
            <Tab>Statistics</Tab>
          </TabList>
          <TabPanel>
            <QueryExecutor ref='right' queryType= {this.props.location.query.queryType} currentDb={this.props.location.query.db} currentItem={this.props.location.query.collection} connectionId={this.props.connectionId}></QueryExecutor>
          </TabPanel>
          <TabPanel>
            <h2>Add document</h2>
          </TabPanel>
          <TabPanel>
            <h2>Update Document</h2>
          </TabPanel>
          <TabPanel>
            <h2>Statistics</h2>
          </TabPanel>
      </Tabs>
      </div>
    );
  }
}

export default CollectionsComponent;
