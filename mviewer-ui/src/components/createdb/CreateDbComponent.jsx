import React from 'react'
import createDbStyles from './createdb.css'
import $ from 'jquery'



class CreateDbComponent extends React.Component {

  render () {

    return(
      <div className={createDbStyles.mainContainer}>
           <div className = {createDbStyles.topContainer}>
             <section className={createDbStyles.topSection}>Welcome to <span className={createDbStyles.span1}>m</span><span className={createDbStyles.span2}>Viewer</span></section>
             <section className={createDbStyles.midSection}><hr />A MONOGO DB MANAGEMENT TOOL<hr /></section>
             <section className={createDbStyles.bottomSection}>LET'S GET STARTED</section>

           </div>
           <div className = {createDbStyles.bottomContainer}>
               <button className={createDbStyles.createButton}>Create New Database</button>
               <section className = {createDbStyles.logoSection}>
                <span>POWERED BY</span>
               <img src={'../../assets/Pramati_Logo.png'} className={createDbStyles.logo}></img>
               </section>

         </div>
      </div>
    );
  }
}

export default CreateDbComponent;
