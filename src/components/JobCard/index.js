import {Link} from 'react-router-dom'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
    rating,
    title,
    location: jobLocation,
    id,
  } = jobData

  return (
    <div className="job-card-container">
      <Link to={`/jobs/${id}`}>
        <li className="card">
          <div className="company-logo-container">
            <div className="img-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
            </div>
            <div className="role-rating-container">
              <h1 className="role">{title}</h1>
              <div className="logo-container">
                <BsStarFill className="icon icon-gold" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-salary-container">
            <div className="only-logos-container">
              <div className="logo-container">
                <MdLocationOn className="icon" />
                <p className="rating">{jobLocation}</p>
              </div>
              <div className="logo-container">
                <BsFillBriefcaseFill className="icon" />
                <p className="rating">{employmentType}</p>
              </div>
            </div>
            <p className="lpa">{packagePerAnnum}</p>
          </div>
          <hr className="line-jobcard" />
          <h1 className="d-head">Description</h1>
          <p className="Description">{jobDescription}</p>
        </li>
      </Link>
    </div>
  )
}

export default JobCard
