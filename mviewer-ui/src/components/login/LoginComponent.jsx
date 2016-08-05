import React from 'react';
import styles from './login.css';
import classNames from 'classnames/bind';
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import $ from 'jquery';
import { browserHistory, hashHistory } from 'react-router';


class LoginComponent extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                host: '127.0.0.1',
                port: '27017',
                username: '',
                password: '',
                canSubmit: false,
                message: ''
            }
        }


        submit(data) {
            alert(JSON.stringify(data, null, 4));
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
                state[key] = e.target.value;
                this.setState(state);
            }.bind(this);
        }

        componentDidMount() {

            var that = this;
            $(function() {
                $('form').on('submit', function(e) {
                    e.preventDefault();
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: 'json',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        crossDomain: false,
                        url: 'http://localhost:8080/services/login',
                        data: $(this).serialize(),
                        success: function(data) {
                            if (data.response.result) {
                                console.log(data.response.result);
                                that.setState({
                                    message: data.response.result
                                });
                                hashHistory.push('/dashboard');
                                console.log(window.location.search.substring(1));
                            }

                            if (data.response.error) {
                                console.log(data.response.error.message);
                                that.setState({
                                    message: data.response.error.message
                                });
                            }

                        },

                        error: function(jqXHR, exception) {
                            console.log(jqXHR);
                            console.log('error');
                            that.setState({
                                message: 'Unexpected Error Occurred'
                            })
                        }


                    });
                });

            });
        }


        render() {
          
    
    var rowClass = 'row inputLabel';  
    return (
<section className={styles.loginForm}>
    <div className="row">
        <h2> mViewer</h2>
    </div>
    <div className='row'>
        <Form className={styles.innerForm} method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()}>

            <div className={ styles.formContainer}>
                <div className='row'>
                    <div className="col span-1-of-3">
                        <label htmlFor="host">Host</label>
                    </div>
                    <div className="col span-1-of-3">
                        <TextInput type="text" name="host" id="host" placeholder="Host id" value={this.state.host} validations='isRequired' onChange={this.handleChange( 'host')} validationError="Host must not be empty" />
                    </div>
                </div>

                <div className={rowClass}>
                    <div className="col span-1-of-3">
                        <label htmlFor="port">Port</label>
                    </div>
                    <div className="col span-1-of-3">
                        <TextInput type="text" name="port" id="port" placeholder="Port" value={this.state.port} onChange={this.handleChange( 'port')} validations="isRequired" validationError="Port must not be empty" />
                    </div>
                </div>

                <div className={rowClass}>
                    <div className="col span-1-of-3">
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="col span-1-of-3">
                        <TextInput type="text" name="username" id="username" placeholder="Username" value={this.state.username} onChange={this.handleChange( 'username')} />
                    </div>
                </div>

                <div className={rowClass}>
                    <div className="col span-1-of-3">
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="col span-1-of-3">
                        <TextInput type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange( 'password')} />
                    </div>
                </div>

                <div className={rowClass}>
                    <div className="col span-3-of-3">
                        <input type="submit" value="Go" disabled={!this.state.canSubmit} className={ styles.gobutton} />
                    </div>
                </div>
                <div className={styles.errorMessage + ' ' + (this.state.message!='' && this.state.message !='Login Success' ? styles.show : styles.hidden)}>{this.state.message}</div>

            </div>
        </Form>
    </div>
</section>
    );
  }

}


export default LoginComponent;
