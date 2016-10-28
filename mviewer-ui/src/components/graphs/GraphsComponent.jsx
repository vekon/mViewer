import React from 'react'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush } from 'recharts';
import service from '../../gateway/service.js'
import graphStyles from './graphs.css'
import privilegesAPI from '../../gateway/privilegesAPI.js';

class GraphsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedTab: 0,
      interval: 0,
      error: false,
      hasRole: null
    }
  }

  componentDidMount(){
    var requestTime = new Date().getTime().toString();
    var partialUrl1 = 'graphs/initiate?connectionId='+this.props.location.query.connectionId+'&ts='+requestTime+'&pollingTime=5000';
    var graphsInitialCall = service('GET', partialUrl1, '');
    graphsInitialCall.then(this.success1.bind(this), this.failure1.bind(this));

    requestTime = new Date().getTime().toString();
    var partialUrl = 'graphs/query?connectionId='+this.props.location.query.connectionId+'&ts='+requestTime;
    var interval = setInterval (function () {
      var graphsCall = service('GET', partialUrl, '');
      graphsCall.then(this.success.bind(this), this.failure.bind(this))
    }.bind(this), 5000);

    this.setState({interval:interval});
  }

  componentWillUnmount()
  {
     clearInterval(this.state.interval);
  }

  success(data){
     this.setState({data: data.response.result});
     
     if(typeof(data.response.error) != 'undefined'){
        if(data.response.error.code == 'INVALID_CONNECTION'){
        this.setState({error:true});
       }
        if (data.response.error.message.indexOf('not authorized on') == -1){
         this.setState({hasRole: true});
       }
       else{
        this.setState({hasRole:false});
       }
     }
     else{
        this.setState({hasRole: true});
     }
     

  }

  success1(data){

  }

  failure(data){

  }

  failure1(data){

  }

  handleSelect(index){
    this.setState({selectedTab:index}, function(){
    });
  }


  render () {
    Tabs.setUseDefaultStyles(false);
    const renderSpecialDot = (props) => {
      const { cx, cy, stroke, key } = props;
      if (cx === +cx && cy === +cy) {
        return <path d={`M${cx - 2},${cy - 2}h4v4h-4Z`} fill={stroke} key={key}/>;
      }
      return null;
    };

    const renderLabel = (props) => {
      const { x, y, textAnchor, key, value } = props;
      if (x === +x && y === +y) {
        return <text x={x} y={y} dy={-10} textAnchor={textAnchor} key={key}>{value}</text>
      }
      return null;
    };

    return (
      <div className = {graphStyles.mainContainer}>
      {!this.state.error ? <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
        <TabList className={graphStyles.tabs}>
          <Tab className={this.state.selectedTab==0 ? graphStyles.activeTab : ''}>Combined View</Tab>
          <Tab className={this.state.selectedTab==1 ? graphStyles.activeTab : ''}>Queries</Tab>
          <Tab className={this.state.selectedTab==2 ? graphStyles.activeTab : ''}>Updates</Tab>
          <Tab className={this.state.selectedTab==3 ? graphStyles.activeTab : ''}>Inserts</Tab>
          <Tab className={this.state.selectedTab==4 ? graphStyles.activeTab : ''}>Deletes</Tab>
        </TabList>
        <TabPanel className={graphStyles.tabPanel}>
         {this.state.hasRole ? <div> 
          <p className={graphStyles.tabTitle}>Combined View</p>
          <ResponsiveContainer width = '100%' height = '100%'>
            <LineChart  data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test" width={this.props.width} height = {this.props.height}>
              <CartesianGrid stroke='#f5f5f5'/>
              <Legend/>
              <XAxis dataKey='TimeStamp' />
              <YAxis allowDataOverflow={true} />
              <Tooltip />
              <Line type='monotone' dataKey='QueryValue' stroke='#ff7300' dot={renderSpecialDot} label={renderLabel}/>
              <Line type='monotone' dataKey='UpdateValue' stroke='#387908' dot={renderSpecialDot} label={renderLabel}/>
              <Line type='monotone' dataKey='InsertValue' stroke='#38abc8' dot={renderSpecialDot} label={renderLabel}/>
              <Line type='monotone' dataKey='DeleteValue' stroke='#383908' dot={renderSpecialDot} label={renderLabel}/>
              <Brush dataKey="TimeStamp" height={30} />
            </LineChart>
         </ResponsiveContainer>
         </div> : (this.state.hasRole ==null ? <div className={graphStyles.loading}><img src={'./images/loading.gif'} ></img><label>Checking for Privileges</label></div> : <div className = {graphStyles.errorHolder}>You are not authorised to view Graphs</div> ) }
        </TabPanel>
        <TabPanel className={graphStyles.tabPanel}>
        {this.state.hasRole ? <div> 
          <p className={graphStyles.tabTitle}>Queries/Second</p>
          <ResponsiveContainer width = '100%' height = '100%'>
            <LineChart  data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} width={this.props.width} height = {this.props.height} syncId="test">
              <CartesianGrid stroke='#f5f5f5'/>
              <Legend/>
              <XAxis dataKey='TimeStamp' />
              <YAxis allowDataOverflow={true} />
              <Tooltip />
              <Line type='monotone' dataKey='QueryValue' stroke='#ff7300' dot={renderSpecialDot} label={renderLabel}/>
              <Brush dataKey="name" height={30} />
            </LineChart>
          </ResponsiveContainer>
          </div> : <div className = {graphStyles.errorHolder}>You are not authorised to view Graphs</div> }
        </TabPanel>
        <TabPanel className={graphStyles.tabPanel}>
        {this.state.hasRole ? <div> 
          <p className={graphStyles.tabTitle}>Updates/Second</p>
          <ResponsiveContainer width = '100%' height = '100%'>
            <LineChart  data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} width={this.props.width} height = {this.props.height} syncId="test">
              <CartesianGrid stroke='#f5f5f5'/>
              <Legend/>
              <XAxis dataKey='TimeStamp' />
              <YAxis allowDataOverflow={true} />
              <Tooltip />
              <Line type='monotone' dataKey='UpdateValue' stroke='#387908' dot={renderSpecialDot} label={renderLabel}/>
              <Brush dataKey="name" height={30} />
            </LineChart>
          </ResponsiveContainer>
          </div> : <div className = {graphStyles.errorHolder}>You are not authorised to view Graphs</div> }
        </TabPanel>
        <TabPanel className={graphStyles.tabPanel}>
        {this.state.hasRole ? <div> 
          <p className={graphStyles.tabTitle}>Inserts/Second</p>
          <ResponsiveContainer width = '100%' height = '100%'>
            <LineChart  data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} width={this.props.width} height = {this.props.height} syncId="test">
              <CartesianGrid stroke='#f5f5f5'/>
              <Legend/>
              <XAxis dataKey='TimeStamp' />
              <YAxis allowDataOverflow={true} />
              <Tooltip />
              <Line type='monotone' dataKey='InsertValue' stroke='#38abc8' dot={renderSpecialDot} label={renderLabel}/>
              <Brush dataKey="name" height={30} />
            </LineChart>
          </ResponsiveContainer>
          </div> : <div className = {graphStyles.errorHolder}>You are not authorised to view Graphs</div> }
        </TabPanel>
        <TabPanel className={graphStyles.tabPanel}>
        {this.state.hasRole ? <div> 
          <p className={graphStyles.tabTitle}>Deletes/Second</p>
          <ResponsiveContainer width = '100%' height = '100%'>
            <LineChart data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}  width={this.props.width} height = {this.props.height} syncId="test">
              <CartesianGrid stroke='#f5f5f5'/>
              <Legend/>
              <XAxis dataKey='TimeStamp' />
              <YAxis allowDataOverflow={true} />
              <Tooltip />
              <Line type='monotone' dataKey='DeleteValue' stroke='#383908' dot={renderSpecialDot} label={renderLabel}/>
              <Brush dataKey="TimeStamp" height={30} />
            </LineChart>
          </ResponsiveContainer>
          </div> : <div className = {graphStyles.errorHolder}>You are not authorised to view Graphs</div> }
        </TabPanel>
      </Tabs> : <p className = {graphStyles.errorHolder}>Not Connected To Mongodb</p>}
      </div>
    );
  }
}

export default GraphsComponent;
