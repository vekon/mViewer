import React from 'react'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush } from 'recharts';
import service from '../../gateway/service.js'
import graphStyles from './graphs.css'

class GraphsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedTab: 0
    }
  }

  componentDidMount(){
    var requestTime = new Date().getTime().toString();
    var partialUrl1 = 'graphs/initiate?connectionId='+this.props.location.query.connectionId+'&ts='+requestTime+'&pollingTime=5000';
    var graphsInitialCall = service('GET', partialUrl1, '');
    graphsInitialCall.then(this.success1.bind(this), this.failure1.bind(this));

    requestTime = new Date().getTime().toString();
    var partialUrl = 'graphs/query?connectionId='+this.props.location.query.connectionId+'&ts='+requestTime;
    setInterval (function () {
      var graphsCall = service('GET', partialUrl, '');
      graphsCall.then(this.success.bind(this), this.failure.bind(this))
    }.bind(this), 5000);
  }

  success(data){
     this.setState({data: data.response.result});
     if(data.response.error){

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
      <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
        <TabList className={graphStyles.treeTab}>
          <Tab><span className={this.state.selectedTab==0 ? graphStyles.activeTab : ''}>Combined View</span></Tab>
          <Tab><span className={this.state.selectedTab==1 ? graphStyles.activeTab : ''}>Queries</span></Tab>
            <Tab><span className={this.state.selectedTab==0 ? graphStyles.activeTab : ''}>Updates</span></Tab>
            <Tab><span className={this.state.selectedTab==1 ? graphStyles.activeTab : ''}>Inserts</span></Tab>
            <Tab><span className={this.state.selectedTab==1 ? graphStyles.activeTab : ''}>Deletes</span></Tab>
        </TabList>
        <TabPanel>
          <p className={graphStyles.tabTitle}>Combined View</p>
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test">
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
        </TabPanel>
        <TabPanel>
          <p className={graphStyles.tabTitle}>Queries/Second</p>
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test">
            <CartesianGrid stroke='#f5f5f5'/>
            <Legend/>
            <XAxis dataKey='TimeStamp' />
            <YAxis allowDataOverflow={true} />
            <Tooltip />
            <Line type='monotone' dataKey='QueryValue' stroke='#ff7300' dot={renderSpecialDot} label={renderLabel}/>
            <Brush dataKey="name" height={30} />
          </LineChart>
        </TabPanel>
        <TabPanel>
          <p className={graphStyles.tabTitle}>Updates/Second</p>
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test">
            <CartesianGrid stroke='#f5f5f5'/>
            <Legend/>
            <XAxis dataKey='TimeStamp' />
            <YAxis allowDataOverflow={true} />
            <Tooltip />
            <Line type='monotone' dataKey='UpdateValue' stroke='#387908' dot={renderSpecialDot} label={renderLabel}/>
            <Brush dataKey="name" height={30} />
          </LineChart>
        </TabPanel>
        <TabPanel>
          <p className={graphStyles.tabTitle}>Inserts/Second</p>
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test">
            <CartesianGrid stroke='#f5f5f5'/>
            <Legend/>
            <XAxis dataKey='TimeStamp' />
            <YAxis allowDataOverflow={true} />
            <Tooltip />
            <Line type='monotone' dataKey='InsertValue' stroke='#38abc8' dot={renderSpecialDot} label={renderLabel}/>
            <Brush dataKey="name" height={30} />
          </LineChart>
        </TabPanel>
        <TabPanel>
          <p className={graphStyles.tabTitle}>Deletes/Second</p>
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }} syncId="test">
            <CartesianGrid stroke='#f5f5f5'/>
            <Legend/>
            <XAxis dataKey='TimeStamp' />
            <YAxis allowDataOverflow={true} />
            <Tooltip />
            <Line type='monotone' dataKey='DeleteValue' stroke='#383908' dot={renderSpecialDot} label={renderLabel}/>
            <Brush dataKey="TimeStamp" height={30} />
          </LineChart>
        </TabPanel>
      </Tabs>
    );
  }
}

export default GraphsComponent;
