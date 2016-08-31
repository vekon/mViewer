import React from 'react'
import gridfsStyles from './gridfs.css'
import QueryExecutor from '../queryexecutor/QueryExecutorComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

class GridFSComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return(
      <div className = {gridfsStyles.mainContainer}>
        <ul className={gridfsStyles.breadCrumb}>
          <li><a href="#">{this.props.location.query.db}</a></li>
          <li><a href="#">{this.props.location.query.fs}</a></li>
        </ul>
        <Tabs onSelect={this.handleSelect} selectedIndex={0}>
          <TabList>
            <Tab>Query Executor</Tab>
            <Tab>Add File(s)</Tab>
            <Tab>Statistics</Tab>
          </TabList>
          <TabPanel>
             <QueryExecutor ref='right' queryType= {this.props.location.query.queryType} currentDb={this.props.location.query.db} currentItem={this.props.location.query.fs} connectionId={this.props.connectionId}></QueryExecutor>
          </TabPanel>
          <TabPanel>
            <h2>Add File(s)</h2>
          </TabPanel>
          <TabPanel>
            <h2>Statistics</h2>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default GridFSComponent;
