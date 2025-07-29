import { BookText, SmileIcon, StarIcon, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getKpiCard } from '../../services/FeedbackServices'

const KpiCards = () => {
    const iconMap = {
        'Total Feedback': <BookText />,
        'Average Satisfaction': <SmileIcon />,
        'Avg Rating': <StarIcon />,
        'Not Satisfaction': <AlertTriangle />,
    };
    const [cardData, setCardData] = useState([])

    useEffect(() => {
        const fetchCard = async () => {
            const fetchedData = await getKpiCard()
            setCardData(fetchedData.data || [])
        }
        fetchCard()
    }, [])

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        {cardData.length === 0 ? (
        <p className="text-gray-500">Loading KPI data...</p>
        ) : (
        cardData.map((item, idx) => (
          <div key={idx} className="bg-slate-100 border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className={`text-${item.iconColor}-600 font-medium`}>{item.delta}</span> vs last period
                </p>
              </div>
              <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:shadow-md transition`}>
                <div className={`text-gray-600 text-xl`}>{iconMap[item.label] || <BookText />}</div>
              </div>
            </div>
          </div>
        ))
    )}
      </div>
    </>
  )
}

export default KpiCards