import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

class Jobs extends Component {
  state = {
    redirectToLogin: false,
    profileData: null,
    isLoading: true,
    error: null,
    employeeTypeList: [],
    minimumSalary: '',
    searchInput: '',
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      this.setState({redirectToLogin: true})
    }
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) throw new Error('Failed to fetch profile details')
      const data = await res.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData, isLoading: false})
    } catch (error) {
      this.setState({error: error.message, isLoading: false})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, employeeTypeList, minimumSalary} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentType = employeeTypeList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumSalary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          title: job.title,
        }))
        if (updatedData.length === 0) {
          this.setState({apiStatus: apiStatusConstants.noJobs})
        } else {
          this.setState({
            jobsList: updatedData,
            apiStatus: apiStatusConstants.success,
          })
        }
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeEmployeeList = employeeTypeId => {
    this.setState(
      prevState => {
        const {employeeTypeList} = prevState
        const updatedList = employeeTypeList.includes(employeeTypeId)
          ? employeeTypeList.filter(id => id !== employeeTypeId)
          : [...employeeTypeList, employeeTypeId]
        return {employeeTypeList: updatedList}
      },
      () => {
        this.getJobs()
      },
    )
  }

  changeSalary = salaryRangeId => {
    this.setState({minimumSalary: salaryRangeId}, () => {
      this.getJobs()
    })
  }

  renderProfile = () => {
    const {profileData, isLoading, error} = this.state
    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    if (error) {
      return <p>{error}</p>
    }
    return (
      <div className="profile-container">
        <img
          src={profileData.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="name">{profileData.name}</h1>
        <p className="para">{profileData.shortBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="jobs-failure-button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, () => {
      this.getJobs()
    })
  }

  renderSearchBar = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          type="search"
          id="searchInput"
          className="search-input"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button-container"
          onClick={this.getJobs}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters or search criteria.
      </p>
    </div>
  )

  renderJobCards = () => {
    const {jobsList} = this.state
    return (
      <div className="cards-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobCards()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.noJobs:
        return this.renderNoJobsView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    const {redirectToLogin} = this.state
    if (redirectToLogin) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="main-container">
          <div className="search">{this.renderSearchBar()}</div>
          <div className="job-container">
            {this.renderProfile()}
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSearchInput={this.changeSearchInput}
              searchInput={searchInput}
              changeSalary={this.changeSalary}
              changeEmployeeList={this.changeEmployeeList}
            />
          </div>
          <div className="search-container">
            <div className="search-medium">{this.renderSearchBar()}</div>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
