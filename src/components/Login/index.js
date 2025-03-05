import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errormsg: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errormsg => {
    this.setState({showSubmitError: true, errormsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch('https://apis.ccbp.in/login', options)
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg || 'Invalid login credentials')
      }
    } catch (error) {
      this.onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div className="input-field-container">
        <label htmlFor="password">PASSWORD</label>
        <input
          className="input-element"
          placeholder="Password"
          value={password}
          id="password"
          type="password"
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="input-field-container">
        <label htmlFor="username">USERNAME</label>
        <input
          className="input-element"
          placeholder="Username"
          value={username}
          id="username"
          type="text"
          onChange={this.onChangeUsername}
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errormsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="logo"
          />
          <div className="login-form">
            <form onSubmit={this.onSubmitForm} className="login-form">
              <div className="input-container">
                {this.renderUsernameField()}
              </div>
              <div className="input-container">
                {this.renderPasswordField()}
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
              {showSubmitError && <p className="error-message">*{errormsg}</p>}
            </form>
            <p className="details">
              <strong>- A project by Pranava Krishna</strong> <br />
              Use the username and password as: <br />
              (henry and henry_the_developer) or
              <br /> (rahul and rahul@2021), respectively.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
