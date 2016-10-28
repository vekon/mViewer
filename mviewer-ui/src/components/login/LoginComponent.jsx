import React from 'react';
import styles from './login.css';
import classNames from 'classnames/bind';
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import $ from 'jquery';
import service from '../../gateway/service.js';
import { browserHistory, hashHistory } from 'react-router';

class LoginComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      host: '127.0.0.1',
      port: '27017',
      username: '',
      password: '',
      userNameError: false,
      passwordError: false,
      dbError: false,
      databases: '',
      canSubmit: false,
      message: '',
      connectionId:'',
      authEnabled: false,
      loading: false,
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
    this.getRequest = this.getRequest.bind(this);
  }

  handleCheck(){
    this.setState({authEnabled:!this.state.authEnabled});
    this.setState({username: ''});
    this.setState({password: ''});
    this.setState({databases: ''});
    this.setState({userNameError: false});
    this.setState({passwordError: false});
    this.setState({dbError: false});

  }

  getRequest() {
    var that = this;
    if(this.state.authEnabled) {
      if(this.state.username == null || this.state.username == ''){
        this.state.userNameError = true;
      } else {
        this.state.userNameError = false;
      }
      if(this.state.password == null || this.state.password == ''){
        this.state.passwordError = true;
      } else {
        this.state.passwordError = false;
      }
      if(this.state.databases == null || this.state.databases == ''){
        this.state.dbError = true;
      } else {
        this.state.dbError = false;
      }
    }
    if(this.state.userNameError || this.state.passwordError || this.state.dbError)
      return false;

    var data = $("form").serialize().split("&");
    var obj={};
    for(var key in data){
      obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    return obj;
  }

  onSubmit() {
    var obj = this.getRequest();
    this.setState({loading : true});
    this.setState({message: ''});
    var loginCall = service('POST', 'login',  obj);
    loginCall.then(this.success, this.failure);
    return loginCall;
  }

  success(data) {
    if (data.response.result) {
      this.setState({message: data.response.result['success']});
      this.setState({loading: false});
      hashHistory.push({ pathname: '/dashboard/home', query: { host: this.state.host, port: this.state.port, username: this.state.username,
                         password: this.state.password, connectionId: data.response.result.connectionId, database: this.state.databases } });
    }
    if (data.response.error) {
      this.setState({message: data.response.error.message});
      this.setState({loading: false});
    }
    
  }

  failure() {
    this.setState({ message: 'Unexpected Error Occurred' });
    this.setState({loading: false});
  }

  enableButton() {
    return function() {
      this.setState({
        canSubmit: true
      });
    }.bind(this);
  }

  disableButton() {
    return function() {
      this.setState({
        canSubmit: false
      });
    }.bind(this);
  }

  handleChange(key) {
    return function(e) {
      var state = {};
      state[key] = e;
      this.setState(state);
    }.bind(this);
  }

  componentDidMount() {
    if (typeof(this.props.location.query.code) != 'undefined' ) {
      this.setState({message: 'You are not connected to Mongo DB'});
    }
  }

  render() {
    var rowClass = 'row inputLabel';
    return (
      <section className={styles.loginForm}>
        <div className={styles.parentDiv + ' ' + styles.clearfix}>

           <div className={styles.two}>
             <div className ={styles.one}>WELCOME TO MVIEWER</div>
            <Form method='POST' onValid={this.enableButton()} onSubmit={this.onSubmit} onInvalid={this.disableButton()} >
              <div className={ styles.formContainer}>
                <div className={styles.inputBoxLogin}>
                  <TextInput type="text" name="host" id="host" placeholder="Host" value={this.state.host} validations='isRequired' onChange={this.handleChange( 'host')} validationError="Host must not be empty" shouldBeDisabled ={this.state.loading} />
                </div>
                <div className={styles.inputBoxLogin}>
                  <TextInput type="text" name="port" id="port" placeholder="Port" value={this.state.port} onChange={this.handleChange( 'port')} validations={{isRequired:true, isNumeric:true}} validationErrors={{isRequired : "Port must not be empty", isNumeric : "Inavlid Port number" }} shouldBeDisabled ={this.state.loading} />
                </div>
                <div className={styles.inputBoxLogin+' '+ styles.checkBox}>
                  <input type="checkbox" className={styles.checkboxClass} name="auth" id="auth"  onChange={this.handleCheck.bind(this)} checked={this.state.authEnabled} disabled ={this.state.loading}  />
                  <div className={styles.checkLabel} onClick ={this.handleCheck.bind(this)} ><span>Perform Authentication</span></div>
                </div>
                <div className={styles.inputBoxLogin}>
                  <TextInput type="text" name="username" id="username" placeholder="Username" value={this.state.username} onChange={this.handleChange( 'username')} shouldBeDisabled={!this.state.authEnabled || this.state.loading} validations={'isRequired1:'+this.state.userNameError} validationErrors={{isRequired1: 'User name must not be empty' }}/>
                </div>
                <div className={styles.inputBoxLogin}>
                  <TextInput type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange( 'password')} shouldBeDisabled={!this.state.authEnabled || this.state.loading} validations={'isRequired1:'+this.state.passwordError}  validationErrors={{isRequired1: 'Password must not be empty' }}/>
                </div>
                <div className={styles.inputBoxLogin}>
                  <TextInput type="text" name="databases" id="databases" placeholder="Database" value={this.state.databases} onChange={this.handleChange( 'databases')} shouldBeDisabled={!this.state.authEnabled || this.state.loading} validations={'isRequired1:'+this.state.dbError} validationErrors={{isRequired1: 'DB name must not be empty'}}/>
                </div>
                <div className={styles.submitContainer}>
                  {this.state.loading == true ? <div className={styles.loader}></div> : null}
                  <input type="submit" value={this.state.loading == true ? "Connecting.." : "CONNECT" } disabled={!this.state.canSubmit || this.state.loading} className={ styles.gobutton} />
                </div>
                <div className={styles.footerLink}>
                   <a href='http://venkoux.github.io/mViewer'>Need Help?</a>
                </div>
                <div className={styles.errorMessage + ' ' + (this.state.message != undefined && this.state.message!='' && this.state.message !='Login Success' ? styles.show : styles.hidden)}>{this.state.message}</div>
              </div>
            </Form>
          </div>
        </div>
      </section>
    );
  }
}

export default LoginComponent;