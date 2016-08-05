import React from 'react'
import dashStyles from './dashBoard.css'
export default React.createClass({
  render() {
    return (
        <div className ='row'>
        <div className = {dashStyles.mainContainer}>
        <header>
           <nav>
               
               <div className="row">
                   <a href= "#" className={dashStyles.logo}>MVIEWER</a>
                   <ul className={dashStyles.mainNav + ' ' + dashStyles.clearfix} >
                       <li><a href="#home">Home</a></li>
                       <li><a href="#serverStatics">Server Statistics</a></li>
                       <li><a href="#mongoGraphs">Mongo Graphs</a></li>
                       <li><a href="#help">help</a></li>
                   </ul>
               </div>
           </nav>
            <div className = {dashStyles.banner}>Banner</div>
        </header>
        </div>
            
        </div>
        
    );
  }
})