import { useEffect, useState } from "react"
import DashCharts from "../components/dashboard/DashCharts"
import KpiCards from "../components/dashboard/kpiCards"
import RecentFeedback from "../components/dashboard/recentFeedback"
import { getMostAnswered, getRecentFeedback } from "../services/FeedbackServices"
const Home = () => {
  const [recent, setRecent] = useState([])
  const [questionList, setQuestionList] = useState([])

  useEffect(() => {
    async function fetch() {
      const respRecent = await getRecentFeedback()
      const mostAnswered = await getMostAnswered()
      setRecent(respRecent.data)
      setQuestionList(mostAnswered.data)
    }
    fetch()
  }, [])


  return (
        <div className=''>
          <h1 className='text-2xl font-bold'>Welcome to the Admin Dashboard</h1>
          <p className='mt-4 text-gray-600'>Welcome back! Here's what's happening today.</p>
            <KpiCards />

            <DashCharts />

            <RecentFeedback feedbackList={recent} questionList={questionList} />
        </div>
  )
}

export default Home