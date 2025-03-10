import './index.css'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1>
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p>
          Millions of people are searching for jobs,salary
          <br /> information,company reviews.Find the job that fits your
          <br /> abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="findJobs-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
